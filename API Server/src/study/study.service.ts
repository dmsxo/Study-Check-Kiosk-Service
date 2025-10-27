import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entitys/attendance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  async check_in(student_id: number) {}

  async check_out(student_id: number) {}

  async generate_code() {}

  async verify_code() {}
}
