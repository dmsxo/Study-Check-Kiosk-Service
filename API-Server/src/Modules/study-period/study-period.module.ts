import { Module } from '@nestjs/common';
import { StudyPeriodService } from './service/study-period.service';
import { StudyPeriodController } from './controller/study-period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPeriod } from './entities/period.entity';
import { OverrideSchedule } from './entities/override-schedule.entity';
import { PeriodSchedule } from './entities/period-schedule.entity';
import { OverrideController } from './controller/override.controller';
import { OverrideService } from './service/override.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyPeriod, PeriodSchedule, OverrideSchedule]),
  ],
  controllers: [StudyPeriodController, OverrideController],
  providers: [StudyPeriodService, OverrideService],
  exports: [StudyPeriodService, OverrideService],
})
export class StudyPeriodModule {}
