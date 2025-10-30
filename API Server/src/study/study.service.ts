import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entitys/attendance.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { formatDate } from 'src/utils/date.helper';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    private userService: UserService,
  ) {}

  async check_in(student_id: number, studyType: string): Promise<Attendance> {
    const user = await this.userService.get_user(student_id);
    const today = formatDate();
    const time = new Date();

    //만약 이미 오늘자 출석기록이 있다면 에러
    const today_attendance = await this.attendanceRepo.findOneBy({
      student_id: user,
      type: studyType,
      date: today,
    });

    if (today_attendance)
      throw new ConflictException(`${studyType} 출석은 이미 완료되었습니다.`);

    // 출석 기록하기
    const attendance = this.attendanceRepo.create({
      student_id: user,
      type: studyType,
      check_in_time: time,
      date: today,
    });
    return await this.attendanceRepo.save(attendance);
  }

  async check_out(
    student_id: number,
    studyType: string,
    description: string,
  ): Promise<Attendance> {
    const user = await this.userService.get_user(student_id);
    const today = formatDate();
    const time = new Date();

    //만약 이미 오늘자 출석기록이 있다면 에러
    const today_attendance = await this.attendanceRepo.findOne({
      where: {
        student_id: user,
        type: studyType,
        date: today,
      },
      relations: ['student_id'],
    });

    if (!today_attendance)
      throw new NotFoundException(
        `오늘자 ${studyType} 학습 체크인 기록이 없습니다.`,
      );

    today_attendance.check_out_time = time;
    today_attendance.description = description;

    return await this.attendanceRepo.save(today_attendance);
  }
}
