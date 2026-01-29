import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/registration.entity';
import { StudyPeriodModule } from '../study-period/study-period.module';
import { GradeCapacity } from '../study-period/entities/grade-capacity.entity';
import { StudyPeriod } from '../study-period/entities/period.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, GradeCapacity, StudyPeriod]),
    StudyPeriodModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
