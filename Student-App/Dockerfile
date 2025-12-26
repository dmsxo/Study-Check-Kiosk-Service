# 1단계: 빌드 스테이지
FROM node:20-alpine AS build-stage
WORKDIR /app

# 캐시 효율을 위해 package.json 먼저 복사
COPY package*.json ./
RUN npm install

# 전체 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2단계: 실행 스테이지 (Nginx)
FROM nginx:stable-alpine
# 1단계에서 빌드된 dist 폴더만 가져옴
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 작성한 Nginx 설정 적용
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]