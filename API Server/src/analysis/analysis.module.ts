import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
