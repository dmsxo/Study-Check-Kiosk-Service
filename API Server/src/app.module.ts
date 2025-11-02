import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StudyModule } from './study/study.module';
import { AnalysisModule } from './analysis/analysis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { CacheModule } from '@nestjs/cache-manager';
import { AttendanceModule } from './attendance/attendance.module';
import * as redisStore from 'cache-manager-ioredis';
/*
src/
├─ auth/
│  ├─ auth.controller.ts       // 로그인/로그아웃
│  ├─ auth.service.ts
│  └─ auth.module.ts
├─ user/
│  ├─ user.controller.ts       // 유저 CRUD
│  ├─ user.service.ts
│  └─ user.module.ts
├─ attendance/
│  ├─ controllers/
│  │  ├─ user-attendance.controller.ts   // /users/:userId/attendances
│  │  └─ all-attendance.controller.ts    // /attendances
│  ├─ services/
│  │  └─ attendance.service.ts           // 모든 출석 로직 담당
│  └─ attendance.module.ts
└─ analysis/
   ├─ analysis.controller.ts
   ├─ analysis.service.ts
   └─ analysis.module.ts
   */

@Module({
  imports: [
    UserModule,
    AuthModule,
    StudyModule,
    AnalysisModule,

    TypeOrmModule.forRoot(typeORMConfig),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      db: 0,
      prefix: '',
    }),
    AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
