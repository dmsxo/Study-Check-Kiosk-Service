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
import { StudentAttendanceDto } from './dto/student-attendance.dto';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(StudyPeriod)
    private readonly periodRepo: Repository<StudyPeriod>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
      student: user,
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

  // test용
  async create_bulk(dtos: CreateAttendanceDto[]): Promise<Attendance[]> {
    const attendances: Attendance[] = [];
    for (const dto of dtos) {
      const user: User = await this.userService.get_user(dto.studentId);
      const period = await this.periodRepo.findOne({
        where: { id: dto.periodId },
      });
      if (!period) throw new NotFoundException('StudyPeriod not found');
      const attendance = this.attendanceRepo.create({
        date: dto.date,
        student: user,
        period,
        check_in_time: dto.check_in_time
          ? this.convertToTime(dto.check_in_time)
          : undefined,
        check_out_time: dto.check_out_time
          ? this.convertToTime(dto.check_out_time)
          : undefined,
        description: dto.description,
      });
      attendances.push(attendance);
    }
    return this.attendanceRepo.save(attendances);
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

  private buildQuery(queryDto: QueryAttendanceDto) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.attendances', 'attendance')
      .innerJoin('attendance.period', 'period')
      .where('period.id = :periodId', { periodId: queryDto.periodId });

    if (queryDto.startDate && queryDto.endDate) {
      qb.andWhere('attendance.date BETWEEN :start AND :end', {
        start: queryDto.startDate,
        end: queryDto.endDate,
      });
    } else if (queryDto.startDate) {
      qb.andWhere('attendance.date >= :start', {
        start: queryDto.startDate,
      });
    } else if (queryDto.endDate) {
      qb.andWhere('attendance.date <= :end', {
        end: queryDto.endDate,
      });
    }

    qb.orderBy('user.id', 'ASC').addOrderBy('attendance.date', 'ASC');

    return qb;
  }

  async getAttendances(
    queryDto: QueryAttendanceDto,
  ): Promise<StudentAttendanceDto[]> {
    const users = await this.buildQuery(queryDto).getMany();

    return users.map((user) => this.mapToDto(user));
  }

  async getStudentAttendances(
    studentId: number,
    queryDto: QueryAttendanceDto,
  ): Promise<StudentAttendanceDto | null> {
    const users = await this.buildQuery(queryDto)
      .andWhere('user.studentId = :studentId', { studentId })
      .getOne();

    return users ? this.mapToDto(users) : null;
  }

  private mapToDto(user: User): StudentAttendanceDto {
    const arr = user.attendances ?? [];
    const attendances = arr.map((a) => ({
      date: a.date,
      checkIn: a.check_in_time?.slice(0, 5) ?? null,
      checkOut: a.check_out_time?.slice(0, 5) ?? null,
      description: a.description,
    }));

    return {
      studentId: user.studentId!,
      studentName: user.name,
      totalCount: attendances.length,
      attendances,
    };
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
