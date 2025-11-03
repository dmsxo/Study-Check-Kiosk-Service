// src/attendance/services/attendance.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { UserService } from './../user/user.service';
import { User } from './../user/entities/user.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

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

  /** ================= 체크인/체크아웃 ================= */

  async checkIn(
    student_id: number,
    type: 'morning' | 'night',
  ): Promise<Attendance> {
    const user = await this.userService.get_user(student_id);

    const existing = await this.attendanceRepo.findOne({
      where: {
        student_id: user,
        type,
        date: new Date().toISOString().slice(0, 10),
      },
    });
    if (existing) throw new BadRequestException('Already checked in');

    const attendance = this.attendanceRepo.create({
      student_id: user,
      type,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      check_in_time: new Date(), // 서버 현재 시간
    });

    return this.attendanceRepo.save(attendance);
  }

  async checkOut(
    student_id: number,
    type: 'morning' | 'night',
    description: string,
  ): Promise<Attendance> {
    const user = await this.userService.get_user(student_id);
    const today = new Date().toISOString().slice(0, 10);

    const attendance = await this.attendanceRepo.findOne({
      where: { student_id: user, type, date: today },
    });
    if (!attendance)
      throw new NotFoundException(
        'Attendance not found. Please check in first.',
      );

    attendance.check_out_time = new Date(); // 서버 현재 시간
    attendance.description = description;
    return this.attendanceRepo.save(attendance);
  }

  /** ================= 조회 ================= */

  async findAllByStudent(
    student_id: number,
    query?: QueryAttendanceDto,
  ): Promise<Attendance[]> {
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

    return qb.orderBy('attendance.date', 'DESC').getMany();
  }

  async findAll(query?: QueryAttendanceDto): Promise<Attendance[]> {
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

    return qb.orderBy('attendance.date', 'DESC').getMany();
  }

  /** ================= 유틸 ================= */

  private convertToTime(timeString: string): Date {
    // HH:MM:SS 문자열 → Date 객체 (1970-01-01 기준)
    return new Date(`1970-01-01T${timeString}`);
  }
}
