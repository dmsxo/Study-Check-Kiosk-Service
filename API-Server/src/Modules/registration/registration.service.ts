import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { UserService } from './../user/user.service';
import { StudyPeriodService } from '../study-period/service/study-period.service';
import { QueryRegistrationDto } from './dto/query-registration.dto';
import { User } from '../user/entities/user.entity';
import { GradeCapacity } from '../study-period/entities/grade-capacity.entity';
import { RegistrationStatus } from 'src/common/enums/registration-status.enum';
@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    @InjectRepository(GradeCapacity)
    private readonly gradeCapacityRepo: Repository<GradeCapacity>,
    private readonly userService: UserService,
    private readonly periodService: StudyPeriodService,
  ) {}

  private getGrade(studentId: number): number {
    return Number(String(studentId)[0]);
  }

  async validateRegistration(student: User, periodId: number) {
    const grade = this.getGrade(student.studentId!);

    const gradeCapacity = await this.gradeCapacityRepo.findOne({
      where: { periodId, grade },
    });

    // capacities에 해당 학년 row가 없으면 "지원 불가 학년"으로 간주
    if (!gradeCapacity) {
      throw new ConflictException(
        'Your grade level does not match the eligibility requirements.',
      );
    }

    const capacity = gradeCapacity.capacity;
    // gradeCapacity.capacity === -1 이면 무제한
    if (capacity === -1 || capacity === null || capacity === undefined) return;

    const currentCount = await this.registrationRepo
      .createQueryBuilder('registration')
      .leftJoin('registration.student', 'student')
      .where('registration.period = :periodId', { periodId })
      .andWhere('registration.status = :status', {
        status: RegistrationStatus.ACTIVE,
      })
      .andWhere(`CAST(student.studentId AS TEXT) LIKE :gradeLike`, {
        gradeLike: `${grade}%`,
      })
      .getCount();

    if (currentCount >= capacity) {
      throw new ConflictException('Registration capacity reached.');
    }
  }

  async createRegisration(registration: CreateRegistrationDto) {
    const student = await this.userService.get_user(registration.studentId);
    const period = await this.periodService.getPeriodById(
      registration.periodId,
    );

    // 중복 신청 방지(Unique 위반 전에 선제 처리)
    const exists = await this.registrationRepo.findOne({
      where: {
        student: { studentId: student.studentId },
        period: { id: period.id },
      },
      relations: ['student', 'period'],
    });
    if (exists)
      throw new ConflictException('Already registered for this period');

    // validate
    await this.validateRegistration(student, period.id);

    const newRegistration = this.registrationRepo.create({
      student,
      period,
      status: registration.status,
    });

    return await this.registrationRepo.save(newRegistration);
  }

  async getRegistration(id: number): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: ['student', 'period'],
    });
    if (!registration)
      throw new NotFoundException(`registration with id:${id} not founded`);
    return registration;
  }

  async getRegistrationByFilter(dto: QueryRegistrationDto) {
    const registration = await this.registrationRepo.findOne({
      where: {
        student: { studentId: dto.studentId },
        period: { id: dto.periodId },
      },
      relations: ['student', 'period'],
    });

    return registration;
  }

  async updateRegistration(id: number, updateStatusDto: UpdateRegistrationDto) {
    return await this.registrationRepo.update(
      { id },
      { status: updateStatusDto.status },
    );
  }

  async deleteRegistration(id: number) {
    return await this.registrationRepo.delete(id);
  }
}
