import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { UserService } from './../user/user.service';
import { StudyPeriodService } from '../study-period/study-period.service';
import { QueryRegistrationDto } from './dto/query-registration.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    private readonly userService: UserService,
    private readonly periodService: StudyPeriodService,
  ) {}

  async createRegisration(registration: CreateRegistrationDto) {
    const student = await this.userService.get_user(registration.studentId);
    const period = await this.periodService.getPeriodById(
      registration.periodId,
    );

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
        student: { id: dto.studentId },
        period: { id: dto.periodId },
      },
    });

    return registration;
  }

  async updateRegistration(id: number, updateStatusDto: UpdateRegistrationDto) {
    console.log(id);
    console.log(updateStatusDto.status);
    return await this.registrationRepo.update(
      { id },
      { status: updateStatusDto.status },
    );
  }

  async deleteRegistration(id: number) {
    return await this.registrationRepo.delete(id);
  }
}
