<p align="center">
  <img src="https://i.namu.wiki/i/J98BX_xZlQHp1NhjNIHDtSScCRpzaV2W3_z3T2rE5TB68AQAM0TiNVIPG9GpsdjyivGdiV8ukihCA67NgwKqoGk9GZqBY37RBKnKP6xDwDux5cpTI3z6mdqZTyjC7hoG4lgTuH69rYvk_EVOS2pvVg.webp" width="120" alt="Deain HighSchool Logo" /></a>
</p>
<br />

# 대인고 자율학습 출석체크 키오스크 
**대인고등학교**의 자율학습 출석체크는 현재 선생님들이 수기로 작성하고 있으며, <br>
이 과정에서 출석 기록의 신뢰성을 보장하기 어렵다는 한계가 존재합니다. 

또한 반복적인 수기 기록은 관리 부담을 증가시키고, 출석 데이터의 체계적인 관리와 활용을 어렵게 만듭니다.

이 프로젝트는 이러한 문제를 해결하기 위해자율학습 시간의 출석체크를 자동화하고, 보다 정확하고 신뢰할 수 있는 출석 관리 환경을 제공하는 것을 목표로 합니다.

## 주요 기능

## 시스템 구조

## 기술 스택
> 다중 클라이언트 환경을 기반으로 한 통합 시스템 구성

### 클라이언트 애플리케이션
- **학생용 PWA**
  - `React` · `Vite`

- **선생님용 관리 데스크탑 앱**
  - `React` · `Electron` · `Vite`

- **키오스크 애플리케이션**
  - `React` · `Electron` · `Vite`

### 백엔드
- **API 서버**
  - `NestJS` (Node.js)

### 데이터베이스 & 스토리지
- `PostgreSQL` (RDBMS) 
- `Redis` (In-memory Cache) 
- `MinIO` (Object Storage)

### 인프라 / 배포
- `Docker`  
- `Ubuntu 22.04` (Linux)

## 실행 방법

## 참고사항