import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
School Self-Study Kiosk Project
Author: Hwang euntea

Module: 
app.module.ts : 전체 기능을 한번에 모으는 모듈
users.module.ts : 사용자(학생, 교사) 관리 모듈
-학생/교사 CRUD 기능
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
