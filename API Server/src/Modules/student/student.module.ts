import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './controllers/student.controller';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [AttendanceModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
