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
