# 1. 빌드 환경 구성
FROM node:20-alpine
WORKDIR /app

# 2. 의존성 설치
COPY package*.json ./
RUN npm install

# 3. 소스 복사 및 빌드 (dist 폴더 생성)
COPY . .
RUN npm run build

# 실행용 서버(Nginx 등)가 없으므로 여기서 끝납니다.