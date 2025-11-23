import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './Modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

/*
School Self-Study Kiosk Project
Author: Hwang euntea

Module: 
app.module.ts : 전체 기능을 한번에 모으는 모듈
users.module.ts : 사용자(학생) 관리 모듈
-학생 CRUD 기능
-생체 정보 등록
auth.module.ts : 인증 모듈
*앱/웹*
-gmail OTP 인증 
-로그인/로그아웃
*키오스크*
-QR 코드 인증
-생체 정보 인증
study.module.ts : 자습 관리 모듈
-아침/야간 자율학습 신청 및 취소
-자습 시작 및 종료
analysis.module.ts : 통계, 레포트 모듈
-전체 학생 출결 통계 (일별/월별/학기별/학년별)
-학생별 출결 통계 (일별/월별/학기별/학년별)
-레포트 생성 및 다운로드
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('School Self-Study Kiosk API')
    .setDescription('API documentation for the School Self-Study Kiosk system')
    .setVersion('1.0')
    .build();

  // Redis Session 사용
  const redisClient = createClient({
    socket: {
      host: 'localhost',
      port: 6379,
    },
  });
  await redisClient.connect();

  const redisStore: any = new RedisStore({
    client: redisClient,
    prefix: 'session:', // 세션 키 prefix (옵션)
    ttl: 60 * 60 * 24 * 2,
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure: false, // https 쓸 땐 true
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2일
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4000',
      'http://localhost:5000',
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드는 제거
      forbidNonWhitelisted: true, // DTO에 없는 필드 있으면 에러
      transform: true, // 자동으로 타입 변환
    }),
  );

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
