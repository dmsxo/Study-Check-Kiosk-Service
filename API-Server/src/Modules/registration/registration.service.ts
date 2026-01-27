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
import { StudyPeriod } from '../study-period/entities/period.entity';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    private readonly userService: UserService,
    private readonly periodService: StudyPeriodService,
  ) {}

  validateRegistration(student: User, period: StudyPeriod) {
    if (Number(String(student.studentId)[0]) !== period.grade) {
      throw new ConflictException(
        'Your grade level does not match the eligibility requirements.',
      );
    }

    if (
      period.capacity != null &&
      (period.registrations?.length ?? 0 >= period.capacity)
    ) {
      throw new ConflictException('Registration capacity reached.');
    }
  }

  async createRegisration(registration: CreateRegistrationDto) {
    const student = await this.userService.get_user(registration.studentId);
    const period = await this.periodService.getPeriodById(
      registration.periodId,
    );

    // validate
    // this.validateRegistration(student, period);

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
