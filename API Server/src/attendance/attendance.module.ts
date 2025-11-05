// src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { UserAttendanceController } from './controllers/userAttendance.controller';
import { AllAttendanceController } from './controllers/allAttendance.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance]), UserModule],
  providers: [AttendanceService],
  controllers: [UserAttendanceController, AllAttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}

//  /
// ├─ users/:userid/attendances/  (GET, POST) //특정학생의 출석기록 조회
// │  ├─ check-in?type={morning|night}   (Post) //체크인 하기-학색
// │  └─ check-out?type={morning|night}&description="" (Post)  //체크아웃 하기-학생
// ├─ attendance/    (GET)
// │  ├─ status/:studentId/ (GET) // 현재 상태 조회 - 학생
// │  │  └─ studying?type={morning|night}  (GET) // 현재 공부중인지 조회 - 학생
// │  └─ :id/  (GET, PATCH, DELETE) //출석기록 상세 조회, 수정, 삭제 - 관리자
