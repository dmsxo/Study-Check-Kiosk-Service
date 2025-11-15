import { Module } from '@nestjs/common';
import { StudyPeriodService } from './study-period.service';
import { StudyPeriodController } from './study-period.controller';

@Module({
  controllers: [StudyPeriodController],
  providers: [StudyPeriodService],
})
export class StudyPeriodModule {}
