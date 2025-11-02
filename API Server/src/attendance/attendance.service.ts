// src/attendance/attendance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAttendanceDto): Promise<Attendance> {
    const user = await this.userRepo.findOne({
      where: { student_id: +dto.student_id },
    });
    if (!user)
      throw new NotFoundException(
        `User with student_id ${dto.student_id} not found`,
      );

    const attendance = this.attendanceRepo.create({
      type: dto.type,
      date: dto.date,
      check_in_time: dto.check_in_time,
      check_out_time: dto.check_out_time,
      description: dto.description,
      student_id: user,
    });

    return this.attendanceRepo.save(attendance);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepo.find({ relations: ['student_id'] });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
      relations: ['student_id'],
    });
    if (!attendance) throw new NotFoundException(`Attendance ${id} not found`);
    return attendance;
  }

  async update(id: number, dto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);

    if (dto.student_id) {
      const user = await this.userRepo.findOne({
        where: { student_id: +dto.student_id },
      });
      if (!user)
        throw new NotFoundException(
          `User with student_id ${dto.student_id} not found`,
        );
      attendance.student_id = user;
    }

    Object.assign(attendance, dto);
    return this.attendanceRepo.save(attendance);
  }

  async remove(id: number): Promise<Attendance> {
    const attendance = await this.findOne(id);
    return this.attendanceRepo.remove(attendance);
  }
}
