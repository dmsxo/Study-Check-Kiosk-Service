import { Module } from '@nestjs/common';
import { StudyPeriodService } from './study-period.service';
import { StudyPeriodController } from './study-period.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPeriod } from './entities/period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPeriod])],
  controllers: [StudyPeriodController],
  providers: [StudyPeriodService],
  exports: [StudyPeriodService],
})
export class StudyPeriodModule {}
