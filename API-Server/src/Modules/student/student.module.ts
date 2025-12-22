import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthStudentController } from './controllers/auth.student.controller';
import { StudentController } from './controllers/student.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { RegistrationModule } from '../registration/registration.module';
import { BullModule } from '@nestjs/bull';
import { AutoCheckoutProcessor } from './auto-checkout.processor';
import { StudyPeriodModule } from '../study-period/study-period.module';

@Module({
  imports: [
    AttendanceModule,
    RegistrationModule,
    StudyPeriodModule,
    BullModule.registerQueue({ name: 'auto-checkout' }),
  ],
  controllers: [StudentController, AuthStudentController],
  providers: [StudentService, AutoCheckoutProcessor],
})
export class StudentModule {}
