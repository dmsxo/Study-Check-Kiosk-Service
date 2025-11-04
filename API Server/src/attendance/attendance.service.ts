// src/attendance/services/attendance.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { UserService } from './../user/user.service';
import { User } from './../user/entities/user.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Attendance } from 'src/attendance/entities/attendance.entity';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  /**
   * 출석 데이터를 JSON 문자열로 직렬화
   * @param {number|string} attendance_id
   * @param {string} isStudy
   * @param {string} type
   * @returns {string} JSON 문자열
   */
  serialize(attendance_id, isStudy) {
    const data = { attendance_id, isStudy };
    try {
      return JSON.stringify(data);
    } catch (err) {
      console.error('직렬화 실패:', err);
      return null;
    }
  }

  // -----------------------------
  // JSON 역직렬화 함수
  // -----------------------------
  /**
   * JSON 문자열을 출석 데이터 객체로 변환
   * @param {string} jsonStr
   * @returns {{attendance_id: number|string, isStudy: boolean, type: string}|null}
   */
  deserialize(jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error('역직렬화 실패:', err);
      return null;
    }
  }

  async getCurrentStudyStatus(student_id: number, type: 'morning' | 'night') {
    const res = await this.cacheManager.get(`study:${student_id}:${type}`);
    if (!res) throw new NotFoundException('key does not exist ');
    return this.deserialize(res);
  }

  async checkIn(
    student_id: number,
    type: 'morning' | 'night',
  ): Promise<Attendance> {
    const exists = await this.cacheManager.get(`study:${student_id}:${type}`);
    if (exists) throw new BadRequestException('Already checked in');

    const now = dayjs().tz('Asia/Seoul');
    const attendanceDto: CreateAttendanceDto = {
      student_id,
      type,
      date: now.format('YYYY-MM-DD'),
      check_in_time: now.format('HH:mm:ss'),
    };
    const attendance = await this.create(attendanceDto);

    // Redis에 attendance.id 저장
    await this.cacheManager.set(
      `study:${student_id}:${type}`,
      { attendance_id: attendance.id, isStudy: true },
      6 * 60 * 60 * 1000,
    );

    return attendance;
  }

  async checkOut(
    student_id: number,
    type: 'morning' | 'night',
    description: string,
  ): Promise<Attendance> {
    // Redis에서 attendance PK 가져오기
    const status = this.deserialize(
      await this.cacheManager.get<string>(`study:${student_id}:${type}`),
    );
    if (!status) {
      throw new NotFoundException(
        'Attendance not found. Please check in first.',
      );
    }
    if (status.isStudy == false) {
      throw new ConflictException(
        `Attendance check for the current study type has been completed today.`,
      );
    }

    const now = dayjs().tz('Asia/Seoul');
    const updateDto: UpdateAttendanceDto = {
      check_out_time: now.format('HH:mm:ss'),
      description,
    };
    const attendance = await this.update(status.attendance_id, updateDto);

    await this.cacheManager.set(
      `study:${student_id}:${type}`,
      { attendance_id: attendance.id, isStudy: false },
      12 * 60 * 60 * 1000,
    );

    return attendance;
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
    const [h, m, s] = timeString.split(':').map(Number);
    return dayjs()
      .tz('Asia/Seoul')
      .hour(h)
      .minute(m)
      .second(s)
      .millisecond(0)
      .toDate();
  }
}
