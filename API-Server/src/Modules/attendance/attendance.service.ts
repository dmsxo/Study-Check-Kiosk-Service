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
import { StudyPeriod } from '../study-period/entities/period.entity';

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
    @InjectRepository(StudyPeriod)
    private readonly periodRepo: Repository<StudyPeriod>,
    private readonly userService: UserService,
  ) {}

  /** ================= CRUD ================= */

  async create(dto: CreateAttendanceDto): Promise<Attendance> {
    const user: User = await this.userService.get_user(dto.studentId);
    const period = await this.periodRepo.findOne({
      where: { id: dto.periodId },
    });
    if (!period) throw new NotFoundException('StudyPeriod not found');
    const attendance = this.attendanceRepo.create({
      date: dto.date,
      studentId: user,
      period,
      check_in_time: dto.check_in_time
        ? this.convertToTime(dto.check_in_time)
        : undefined,
      check_out_time: dto.check_out_time
        ? this.convertToTime(dto.check_out_time)
        : undefined,
      description: dto.description,
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
    Object.assign(attendance, {
      ...dto,
      studentId: undefined,
      periodId: undefined,
    }); // studentId/period는 변경 금지
    return this.attendanceRepo.save(attendance);
  }

  async findOneById(attendanceId: number): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { id: attendanceId },
      relations: ['studentId', 'period'],
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
    studentId: number,
    query?: QueryAttendanceDto,
  ): Promise<ResponseAttendanceDto[]> {
    const user = await this.userService.get_user(studentId);

    const qb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.studentId', 'student')
      .leftJoinAndSelect('attendance.period', 'period')
      .where('attendance.studentId = :studentId', {
        studentId: user.id,
      });

    // if (query?.type) {
    //   qb.andWhere('attendance.type = :type', { type: query.type });
    // }

    if (query?.periodId) {
      qb.andWhere('attendance.period = :periodId', {
        periodId: query.periodId,
      });
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
      .leftJoinAndSelect('attendance.studentId', 'student')
      .leftJoinAndSelect('attendance.period', 'period');

    // if (query?.type) {
    //   qb.andWhere('attendance.type = :type', { type: query.type });
    // }

    if (query?.periodId) {
      qb.andWhere('attendance.period = :periodId', {
        periodId: query.periodId,
      });
    }

    if (query?.date_from && query?.date_to) {
      qb.andWhere('attendance.date BETWEEN :from AND :to', {
        from: query.date_from,
        to: query.date_to,
      });
    }

    if (query?.studentId_like)
      qb.andWhere(`CAST(student.studentId AS TEXT) LIKE :id_like`, {
        id_like: `${query.studentId_like}%`,
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
