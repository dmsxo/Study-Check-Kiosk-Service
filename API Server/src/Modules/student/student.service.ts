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
import { StudyType } from 'src/common/enums/study-type.enum';
import { RegistrationService } from '../registration/registration.service';
import { RegistrationStatus } from 'src/common/enums/registration-status.enum';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class StudentService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
    private readonly registrationService: RegistrationService,
  ) {}
  // 내 프로필 가져오기
  async getMyProfile(studentId: number) {
    return this.userService.get_user(studentId);
  }

  // 현재 공부중인 출석기록 가져오기
  async getCurrentStudyStatus(
    studentId: number,
    type: StudyType,
  ): Promise<ResponseAttendanceDto | null> {
    try {
      // redis에서 현재 공부중인 키 조회
      const status = await this.cacheManager.get<StudyCacheStatus>(
        `study:${studentId}:${type}`,
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
    studentId: number,
  ): Promise<ResponseAttendanceDto[] | null> {
    const attendances =
      await this.attendanceService.findAllByStudent(studentId);
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  // 인증후 스터디 타입 반환, 아니면 에러 내기
  async validateRegistration(studentId, periodId): Promise<StudyType> {
    // regi 가져오기
    const registration = await this.registrationService.getRegistrationByFilter(
      {
        studentId,
        periodId,
      },
    );

    if (!registration)
      throw new NotFoundException('registration not founded :(');
    //status 확인
    if (registration.status !== RegistrationStatus.ACTIVE)
      throw new BadRequestException(
        `student id with ${studentId} is not ACTIVE`,
      );
    // period
    const currentPeriod = registration.period;
    //period로 운영 기간 확인
    const currentDate = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');
    const operateDate = currentPeriod.operation;
    if (currentDate < operateDate.start || operateDate.end < currentDate)
      throw new BadRequestException(
        "It's currently not the designated study period.",
      );
    //period로 운영 시간 확인
    const currentTime = dayjs().tz('Asia/Seoul').format('HH:mm:ss');
    const dailyOperateTime = registration.period.dailyOperation;
    const startTime = dayjs(dailyOperateTime.start)
      .subtract(1, 'hour')
      .format('HH:mm:ss');
    const endTime = dayjs(dailyOperateTime.end)
      .subtract(1, 'hour')
      .format('HH:mm:ss');

    if (currentTime < startTime || endTime < currentTime) {
      throw new BadRequestException(
        "It's currently not the designated study time.",
      );
    }

    return registration.period.studyType;
  }

  async checkIn(
    studentId: number,
    checkInDto: CheckInDto,
    // periodId: number,
    // ttl: number = 6 * 60 * 60 * 1000,
  ): Promise<ResponseAttendanceDto | null> {
    const { periodId, ttl }: CheckInDto = checkInDto;
    // period 검증
    const type = await this.validateRegistration(studentId, periodId);
    // Redis에서 현재 공부중인지 확인
    const exists = await this.cacheManager.get<StudyCacheStatus>(
      `study:${studentId}`,
    );
    // 이미 체크인 한 상태라면 에러 반환
    if (exists && !exists.isStudy)
      throw new BadRequestException('Already checked in');

    // 출석 기록 생성
    const now = dayjs().tz('Asia/Seoul');
    const attendanceDto: CreateAttendanceDto = {
      studentId,
      type,
      date: now.format('YYYY-MM-DD'),
      check_in_time: now.format('HH:mm:ss'),
    };
    const attendance = await this.attendanceService.create(attendanceDto);

    // Redis에 attendance.id 저장
    await this.cacheManager.set(
      `study:${studentId}`,
      { attendance_id: attendance.id, isStudy: true },
      ttl ?? 6 * 60 * 60 * 1000,
    );
    // 출석 기록 DTO 변환후 반환
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  async checkOut(
    studentId: number,
    checkOutDto: CheckOutDto,
    // description: string,
    // ttl: number = 6 * 60 * 60 * 1000,
  ): Promise<ResponseAttendanceDto | null> {
    const { description, ttl }: CheckOutDto = checkOutDto;
    // Redis에서 attendance PK 가져오기
    const status = await this.cacheManager.get<StudyCacheStatus>(
      `study:${studentId}`,
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
      description: description ?? '',
    };
    const attendance = await this.attendanceService.update(
      status.attendance_id,
      updateDto,
    );

    await this.cacheManager.set(
      `study:${studentId}`,
      { attendance_id: attendance.id, isStudy: false },
      ttl ?? 6 * 60 * 60 * 1000,
    );

    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }
}
