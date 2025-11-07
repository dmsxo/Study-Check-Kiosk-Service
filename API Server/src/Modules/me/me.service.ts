import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
import { Inject } from '@nestjs/common';
import { StudyCacheStatus } from '../attendance/interface/study-cache-status.interface';
import { ResponseAttendanceDto } from '../attendance/dto/response-attendance.dto';
import { plainToInstance } from 'class-transformer';
import { CreateAttendanceDto } from '../attendance/dto/create-attendance.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateAttendanceDto } from '../attendance/dto/update-attendance.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class MeService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
  ) {}
  // 내 프로필 가져오기
  async getMyProfile(student_id: number) {
    return this.userService.get_user(student_id);
  }

  // 현재 공부중인 출석기록 가져오기
  async getCurrentStudyStatus(
    student_id: number,
    type: 'morning' | 'night',
  ): Promise<ResponseAttendanceDto | null> {
    try {
      // redis에서 현재 공부중인 키 조회
      const status = await this.cacheManager.get<StudyCacheStatus>(
        `study:${student_id}:${type}`,
      );
      if (!status) throw new NotFoundException('key does not exist ');

      // 공부중이라면 출석기록 반환
      if (status.isStudy) {
        const currunt = await this.attendanceService.findOneById(
          status.attendance_id,
        );
        return plainToInstance(ResponseAttendanceDto, currunt, {
          excludeExtraneousValues: true,
        });
      }
      return null;
    } catch {
      return null;
    }
  }

  // 출석 기록 가져오기
  async getMyAttendances(
    student_id: number,
  ): Promise<ResponseAttendanceDto[] | null> {
    const attendances =
      await this.attendanceService.findAllByStudent(student_id);
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  async checkIn(
    student_id: number,
    type: 'morning' | 'night',
  ): Promise<ResponseAttendanceDto | null> {
    // Redis에서 현재 공부중인지 확인
    const exists = await this.cacheManager.get<StudyCacheStatus>(
      `study:${student_id}:${type}`,
    );
    // 이미 체크인 한 상태라면 에러 반환
    if (exists && !exists.isStudy)
      throw new BadRequestException('Already checked in');

    // 출석 기록 생성
    const now = dayjs().tz('Asia/Seoul');
    const attendanceDto: CreateAttendanceDto = {
      student_id,
      type,
      date: now.format('YYYY-MM-DD'),
      check_in_time: now.format('HH:mm:ss'),
    };
    const attendance = await this.attendanceService.create(attendanceDto);

    // Redis에 attendance.id 저장
    await this.cacheManager.set(
      `study:${student_id}:${type}`,
      { attendance_id: attendance.id, isStudy: true },
      6 * 60 * 60 * 1000,
    );
    // 출석 기록 DTO 변환후 반환
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }
  async checkOut(
    student_id: number,
    type: 'morning' | 'night',
    description: string,
  ): Promise<ResponseAttendanceDto | null> {
    // Redis에서 attendance PK 가져오기
    const status = await this.cacheManager.get<StudyCacheStatus>(
      `study:${student_id}:${type}`,
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
    const attendance = await this.attendanceService.update(
      status.attendance_id,
      updateDto,
    );

    await this.cacheManager.set(
      `study:${student_id}:${type}`,
      { attendance_id: attendance.id, isStudy: false },
      12 * 60 * 60 * 1000,
    );

    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }
}
