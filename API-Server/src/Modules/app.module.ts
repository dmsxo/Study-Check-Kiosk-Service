import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnalysisModule } from './analysis/analysis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from '../configs/typeorm.config';
import { CacheModule } from '@nestjs/cache-manager';
import { AttendanceModule } from './attendance/attendance.module';
import { StudentModule } from './student/student.module';
import { redisStore } from 'cache-manager-ioredis-yet';
import { KioskModule } from './kiosk/kiosk.module';
import { HealthModule } from './health/health.module';
import { ImagesModule } from 'src/Modules/images/images.module';
import { RegistrationModule } from './registration/registration.module';
import { StudyPeriodModule } from './study-period/study-period.module';
import { ScheduleModule } from './schedule/schedule.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
/*
src/
├─ auth/
│  ├─ login
│  ├─ logout
│  ├─ checkin/code   (Post)
│  └─ checkin/verify (Post)
├─ users/            (Post, Get)
│  └─ :id/
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
    TypeOrmModule.forRoot(typeORMConfig),

    ConfigModule.forRoot({
      isGlobal: true, // 전역 환경변수
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
          db: 0,
          keyPrefix: '',
        }),
      }),
    }),

    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),

    UserModule,
    AuthModule,
    AnalysisModule,
    AttendanceModule,
    StudentModule,
    KioskModule,
    HealthModule,
    ImagesModule,
    RegistrationModule,
    StudyPeriodModule,
    ScheduleModule,
  ],
})
export class AppModule {}
