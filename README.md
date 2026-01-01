<p align="center">
  <img src="https://i.namu.wiki/i/J98BX_xZlQHp1NhjNIHDtSScCRpzaV2W3_z3T2rE5TB68AQAM0TiNVIPG9GpsdjyivGdiV8ukihCA67NgwKqoGk9GZqBY37RBKnKP6xDwDux5cpTI3z6mdqZTyjC7hoG4lgTuH69rYvk_EVOS2pvVg.webp" width="120" alt="Deain HighSchool Logo" /></a>
</p>
<br />

# 대인고 자율학습 출석체크 키오스크 
**대인고등학교**의 자율학습 출석체크는 현재 선생님들이 수기로 작성하고 있으며, <br>
이 과정에서 출석 기록의 신뢰성을 보장하기 어렵다는 한계가 존재합니다. 

또한 반복적인 수기 기록은 관리 부담을 증가시키고, 출석 데이터의 체계적인 관리와 활용을 어렵게 만듭니다.

이 프로젝트는 이러한 문제를 해결하기 위해자율학습 시간의 출석체크를 자동화하고, 보다 정확하고 신뢰할 수 있는 출석 관리 환경을 제공하는 것을 목표로 합니다.

## 시스템 구조 및 주요 기능
> 출결 데이터의 **신뢰성(Reliability)** 과 **일관성(Consistency)** 을 최우선으로 설계된 통합 시스템입니다.

### 시스템 구성 개요

- 학생의 체크인은 **쉽고 빠르고 간편하며 신뢰성있는** 구조로 동작합니다.
- 키오스크 애플리케이션, 학생용 PWA, 교사용 데스크탑 앱은 **직접 데이터베이스에 접근하지 않습니다.**
- 모든 출결 관련 요청은 **단일 API 서버**를 통해 처리되어 비즈니스 로직과 데이터 처리를 중앙에서 통제합니다.

### 체크인 파이프라인
본 시스템의 체크인 기능은 **Issuer 기반 인증 구조**를 중심으로 설계되었습니다.  
QR 인증, 키 입력 등 다양한 인증 방식은 모두 공통된 Issuer 인증 단계를 거쳐,
단일한 체크인/체크아웃 파이프라인으로 연결됩니다.

#### Issuer 기반 인증

- 서버는 6자리 인증 코드를 key로 하는 Issuer 객체를 Redis에 저장합니다.
- Issuer는 짧은 TTL(Time To Live)을 가지며, 일회성 또는 단기 인증을 목적으로 사용됩니다.
- 학생 또는 키오스크는 해당 인증 코드를 제출하여 인증을 시도합니다.
- 서버는 Redis에서 코드를 조회하여 Issuer의 유효성을 검증합니다.
- 인증에 성공하면 Issuer에 포함된 정보(studentId, periodId, action 등)를 기반으로
  체크인 또는 체크아웃 로직을 수행합니다.

이를 통해 인증 수단(QR, 키 입력 등)은 서로 독립적으로 확장할 수 있으며,
출석 처리 로직은 하나의 공통 파이프라인으로 유지됩니다.

#### 체크인 처리 흐름

1. Issuer 인증 성공 후, 학생 ID와 스터디 기간 ID를 기반으로 등록 정보를 검증합니다.
2. 등록 상태가 ACTIVE인지 확인하고, 운영 기간 및 일일 운영 시간 내인지 검증합니다.
3. Redis를 통해 해당 학생이 이미 체크인 상태인지 확인합니다.
4. 체크인 상태가 아니라면 Attendance 레코드를 생성합니다.
5. Redis에 학습 상태(study)를 저장하여 체크인 세션을 관리합니다.
6. 자동 체크아웃이 설정된 경우, 종료 시점에 맞춰 비동기 작업을 예약합니다.

Redis는 실시간 학습 상태를 관리하는 세션 저장소로 사용되며,
데이터베이스는 출석 기록의 영속성을 보장하는 역할을 담당합니다.

#### 체크아웃 처리 흐름
1. Issuer 인증을 성공합니다.
2. Redis에서 학생의 학습 상태를 조회합니다.
3. 체크인 상태가 존재하지 않으면 체크아웃을 거부합니다.
4. 현재 시간이 허용된 체크아웃 시간 범위 내인지 확인합니다.
5. Attendance 레코드를 업데이트하여 체크아웃 시간을 기록합니다.
6. Redis 상태를 갱신하여 학습 종료 상태를 반영합니다.

---

#### 전체 체크인/아웃 흐름 다이어그램

```mermaid
flowchart TB
    A["인증 코드 제출<br>(QR / Key)"] --> B["Redis Issuer 조회"]
    B --> C{"Issuer 유효?"}
    C -- No --> Z["인증 실패"]
    C -- Yes --> D["Issuer 기반 요청 생성<br>(studentId, periodId, action)"]
    D --> E["등록 및 운영 조건 검증<br>(validateRegistration)"]
    E --> F{"검증 성공?"}
    F -- No --> Z
    F -- Yes --> G{"Action 분기"}
    G -- CHECK_IN --> H["Redis 학습 상태 확인"]
    H --> I{"이미 체크인?"}
    I -- Yes --> Z
    I -- No --> J["Attendance 생성"]
    J --> K["Redis 학습 상태 저장"]
    K --> L["체크인 완료"]
    G -- CHECK_OUT --> M["Redis 학습 상태 조회"]
    M --> N{"체크인 상태?"}
    N -- No --> Z
    N -- Yes --> O["Attendance 업데이트"]
    O --> P["Redis 상태 갱신"]
    P --> Q["체크아웃 완료"]
```

### 맞춤형 학사일정 관리 및 운영 제어
본 시스템은 학교의 실제 운영 환경을 고려하여  
**학사일정 기반의 출석 운영과 실시간 제어 기능을 통합적으로 제공**하는 것을 목표로 합니다.

선생님께서는 학사일정을 중심으로 평상시 운영 정보와 특별 일정을 체계적으로 관리하실 수 있으며,  
운영 중인 출석 현황을 실시간으로 모니터링하고 필요 시 즉각적인 운영 개입이 가능하도록 설계되었습니다.

---

#### 주간 단위 자율학습 운영 관리

선생님께서는 **주 단위 학사일정 관리 기능**을 통해  
요일별 자율학습 운영 여부, 운영 시간, 출석 인정 기준 등을 사전에 설정하실 수 있습니다.  
해당 설정은 매주 반복적으로 적용되어, 별도의 수동 개입 없이도 안정적인 일상 운영을 지원합니다.

이를 통해 자율학습 운영 정책을 일관되게 유지하면서도,  
학교별 운영 방식에 맞춘 유연한 설정이 가능합니다.

![Weekly Schedule](docs/images/weekly-schedule.png)

---

#### 휴무일 및 비정기 일정 관리

공휴일, 학교 재량 휴업일, 시험 기간 등  
정기적인 자율학습 운영에서 제외되어야 하는 날짜는  
**캘린더 기반 일정 관리 기능을 통해 별도로 관리**할 수 있습니다.

선생님께서는 특정 날짜를 비운영일로 지정하거나,  
기존 운영 정책을 일시적으로 변경하여  
해당 일자에는 출석 체크 기능이 자동으로 비활성화되도록 설정하실 수 있습니다.

이를 통해 예외적인 일정이 많은 학교 환경에서도  
출석 운영의 혼선을 최소화할 수 있습니다.

![Calendar](docs/images/calendar.png)

---

#### 자율학습 기간 및 운영 정보 설정

본 시스템은 자율학습을 운영할 **기간, 운영 시간, 학습 유형 및 출석 기준**을  
명확하게 설정할 수 있도록 지원합니다.

선생님께서는 학기 중 상시 자율학습뿐만 아니라,  
시험 대비 기간, 방학 중 특별 자율학습 등과 같이  
**한시적으로 운영되는 자율학습 일정도 손쉽게 구성**하실 수 있습니다.

이를 통해 학교의 교육 일정 변화에 따라  
출석 정책을 유연하게 조정할 수 있습니다.

<table align="center">
  <tr>
    <td align="center">
      <img src="docs/images/study-period.png" />
    </td>
    <td align="center">
      <img src="docs/images/create-study-period.png" />
    </td>
  </tr>
</table>

---

#### 실시간 모니터링 및 출석 상태 제어

본 시스템은 **실시간 출석 현황 모니터링 기능**을 핵심 요소로 제공합니다.  
선생님께서는 현재 자율학습에 참여 중인 학생의 상태를 실시간으로 확인하실 수 있으며,  
필요한 경우 특정 학생의 출석 상태를 **강제로 체크인, 체크아웃 또는 결석 처리**하실 수 있습니다.

이는 네트워크 오류, 기기 문제, 현장 상황 등으로 인해  
정상적인 출석 처리가 어려운 경우에도  
운영의 연속성과 출석 데이터의 신뢰성을 확보하기 위함입니다.

모든 출석 상태 변경은 기록으로 남아  
사후 확인 및 운영 관리에 활용될 수 있습니다.

![Realtime Monitoring](docs/images/realtime-monitoring.png)

---

본 기능을 통해 본 시스템은 단순한 자동 출석 시스템을 넘어,  
현장 상황과 선생님의 판단을 반영할 수 있는  
**능동적이고 통제 가능한 자율학습 운영 도구**로서 기능합니다.

### 데이터 분석 및 통계 제공
본 시스템은 출석 과정에서 수집된 데이터를 체계적으로 저장하고 분석하여,
학교 운영 및 생기부 작성에 에 활용하실 수 있는 통계 및 분석 정보를 제공하고자 합니다.

제공되는 주요 분석 항목은 다음과 같습니다.
- 학생별 출석, 결석, 미인증 출석 현황
- 총 공부 시간
- 총 출석일
- 기간별 출석률

![Analytics](docs/images/analytics.png)

분석 결과는 관리자 대시보드를 통해 시각적으로 제공되며,
필요에 따라 외부 분석이 가능하도록 데이터 파일 형태(Exel)로도 추출하실 수 있습니다.

이를 통해 출석 관리는 단순한 기록 관리의 수준을 넘어,
학교 운영 개선과 합리적인 의사결정을 지원하는 데이터 기반 관리 체계로 활용될 수 있을 것으로 기대됩니다.

### 데이터베이스 설계 (ERD)
>출석 시스템은 `사용자(User)`, `신청(Registration)`, `출석 기록(Attendance)`을 중심으로 구성되어 있으며,
자율학습 `운영 기간(StudyPeriod)`을 기준으로 `신청(Registration)`을 관리합니다. `출석(Attendance)`은 사용자 단위로 기록되며, 운영 일정은 `기본 일정(DefaultSchedule)`과 특정 날짜에 대한 `예외 일정(OverrideSchedule)`으로 분리하여 설계하였습니다. 이를 통해 학사 일정 변경에 유연하게 대응할 수 있도록 하였습니다.
```mermaid
erDiagram
    USER ||--o{ REGISTRATION : applies
    USER ||--o{ ATTENDANCE : checks
    STUDY_PERIOD ||--o{ REGISTRATION : has

    STUDY_PERIOD {
        int id PK
        int termId
        int grade
        enum studyType
        date registration_start
        date registration_end
        date operation_start
        date operation_end
        time daily_start
        time daily_end
        int capacity
    }

    USER {
        int id PK
        string name
        int studentId
        string description
        string profileImageFilename
    }

    REGISTRATION {
        int id PK
        date applied_at
        enum status
    }

    ATTENDANCE {
        int id PK
        enum type
        date date
        time check_in_time
        time check_out_time
        string description
    }

    DEFAULT_SCHEDULE {
        int id PK
        int grade
        enum studyType
        enum weekday
        boolean isOpen
    }

    OVERRIDE_SCHEDULE {
        int id PK
        int grade
        enum studyType
        date date
        boolean isOpen
    }
```


## 기술 스택
> 다중 클라이언트 환경을 기반으로 한 통합 시스템 구성

### 프론트 엔드

**학생용 PWA 어플리케이션**  
[![React][React.js]][React-url]
[![Vite][Vite.js]][Vite-url]

**선생님용 관리 데스크탑 어플리케이션**  
[![React][React.js]][React-url]
[![Electron][Electron.js]][Electron-url]
[![Vite][Vite.js]][Vite-url]

**키오스크 애플리케이션**  
[![React][React.js]][React-url]
[![Electron][Electron.js]][Electron-url]
[![Vite][Vite.js]][Vite-url]

---

### 백엔드

**API 서버**  
[![NestJS][NestJS]][NestJS-url]
[![NodeJS][Node.js]][Node-url]

---

### 데이터베이스 & 스토리지

[![PostgreSQL][Postgres]][Postgres-url] 
[![Redis][Redis]][Redis-url] 
[![MinIO][MinIO]][MinIO-url]

---

### 인프라 / 배포

[![Docker][Docker]][Docker-url]
[![DockerCompose][DockerCompose]][DockerCompose-url]
[![Nginx][Nginx]][Nginx-url]
[![Ubuntu][Ubuntu]][Ubuntu-url]

<!-- ## 실행 방법 -->

<!-- ## 참고사항 -->


<!-- Frontend -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/

[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E
[Vite-url]: https://vitejs.dev/

[Electron.js]: https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9
[Electron-url]: https://www.electronjs.org/

<!-- Backend -->
[NestJS]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/

<!-- Database & Storage -->
[Postgres]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/

[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/

[MinIO]: https://img.shields.io/badge/MinIO-C72E49?style=for-the-badge&logo=minio&logoColor=white
[MinIO-url]: https://min.io/

<!-- Infrastructure -->
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/

[DockerCompose]: https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white
[DockerCompose-url]: https://docs.docker.com/compose/

[Ubuntu]: https://img.shields.io/badge/Ubuntu_22.04-E95420?style=for-the-badge&logo=ubuntu&logoColor=white
[Ubuntu-url]: https://ubuntu.com/

[Nginx]: https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white
[Nginx-url]: https://nginx.org/