// src/attendance/services/attendance.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Attendance } from 'src/Modules/attendance/entities/attendance.entity';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { plainToInstance } from 'class-transformer';
import { ResponseAttendanceDto } from './dto/response-attendance.dto';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    private readonly userService: UserService,
  ) {}

  /** ================= CRUD ================= */

  async create(dto: CreateAttendanceDto): Promise<Attendance> {
    const user: User = await this.userService.get_user(dto.student_id);
    const attendance = this.attendanceRepo.create({
      ...dto,
      student_id: user,
      check_in_time: dto.check_in_time
        ? this.convertToTime(dto.check_in_time)
        : undefined,
      check_out_time: dto.check_out_time
        ? this.convertToTime(dto.check_out_time)
        : undefined,
    });
    return this.attendanceRepo.save(attendance);
  }

  async update(
    attendanceId: number,
    dto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = await this.findOneById(attendanceId);
    if (dto.check_in_time)
      attendance.check_in_time = this.convertToTime(dto.check_in_time);
    if (dto.check_out_time)
      attendance.check_out_time = this.convertToTime(dto.check_out_time);
    Object.assign(attendance, { ...dto, student_id: undefined }); // student_id는 변경 금지
    return this.attendanceRepo.save(attendance);
  }

  async findOneById(attendanceId: number): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { id: attendanceId },
    });
    if (!attendance) throw new NotFoundException('Attendance not found');
    return attendance;
  }

  async remove(attendanceId: number): Promise<Attendance> {
    const attendance = await this.findOneById(attendanceId);
    return this.attendanceRepo.remove(attendance);
  }

  /** ================= 조회 ================= */

  async findAllByStudent(
    student_id: number,
    query?: QueryAttendanceDto,
  ): Promise<ResponseAttendanceDto[]> {
    const user = await this.userService.get_user(student_id);

    const qb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.student_id = :student_id', {
        student_id: user.id,
      });

    if (query?.type) {
      qb.andWhere('attendance.type = :type', { type: query.type });
    }

    if (query?.date_from && query?.date_to) {
      qb.andWhere('attendance.date BETWEEN :from AND :to', {
        from: query.date_from,
        to: query.date_to,
      });
    }

    const attendances = await qb.orderBy('attendance.date', 'DESC').getMany();
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(query?: QueryAttendanceDto): Promise<ResponseAttendanceDto[]> {
    const qb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student_id', 'student');

    if (query?.type) {
      qb.andWhere('attendance.type = :type', { type: query.type });
    }

    if (query?.date_from && query?.date_to) {
      qb.andWhere('attendance.date BETWEEN :from AND :to', {
        from: query.date_from,
        to: query.date_to,
      });
    }

    if (query?.student_id_like)
      qb.andWhere(`CAST(student.student_id AS TEXT) LIKE :id_like`, {
        id_like: `${query.student_id_like}%`,
      });

    const attendances = await qb.orderBy('attendance.date', 'DESC').getMany();
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  /** ================= 유틸 ================= */

  private convertToTime(timeString: string): string {
    const [h, m, s] = timeString.split(':').map(Number);
    return dayjs()
      .tz('Asia/Seoul')
      .hour(h)
      .minute(m)
      .second(s)
      .millisecond(0)
      .format('HH:mm:ss');
  }
}
