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

### 맞춤형 학사일정 관리 및 운영 제어

### 데이터 분석 및 통계 제공

### 데이터베이스 설계 (ERD)
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