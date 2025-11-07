import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthStudentController } from './controllers/auth.student.controller';
import { StudentController } from './controllers/student.controller';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [AttendanceModule],
  controllers: [StudentController, AuthStudentController],
  providers: [StudentService],
})
export class StudentModule {}
