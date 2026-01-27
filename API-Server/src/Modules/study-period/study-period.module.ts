import { Module } from '@nestjs/common';
import { StudyPeriodService } from './service/study-period.service';
import { StudyPeriodController } from './controller/study-period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPeriod } from './entities/period.entity';
import { OverrideSchedule } from './entities/override-schedule.entity';
import { PeriodSchedule } from './entities/period-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyPeriod, PeriodSchedule, OverrideSchedule]),
  ],
  controllers: [StudyPeriodController],
  providers: [StudyPeriodService],
  exports: [StudyPeriodService],
})
export class StudyPeriodModule {}
