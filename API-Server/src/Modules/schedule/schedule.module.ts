import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodSchedule } from './entities/period-schedule.entity';
import { OverrideSchedule } from './entities/override-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PeriodSchedule, OverrideSchedule])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
