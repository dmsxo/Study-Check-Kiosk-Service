import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}
}
