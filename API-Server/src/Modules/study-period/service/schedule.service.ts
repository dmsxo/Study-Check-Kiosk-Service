import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OverrideSchedule } from '../entities/override-schedule.entity';
import { CreateOverrideScheduleDto } from '../dto/override/create-override-schedule.dto';
import { DeleteResult } from 'typeorm/browser';
import { QueryOverrideScheduleDto } from '../dto/override/query-override-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(OverrideSchedule)
    private readonly overrideScheduleRepo: Repository<OverrideSchedule>,
  ) {}
  // override schedule
  async createOverrideSchedule(
    overrideDto: CreateOverrideScheduleDto,
  ): Promise<OverrideSchedule> {
    // 기존에 해당 날짜/학년의 설정이 있는지 확인
    const existing = await this.overrideScheduleRepo.findOneBy({
      date: overrideDto.date,
      grade: overrideDto.grade,
      periodId: overrideDto.periodId,
    });

    if (existing) {
      // 있다면 업데이트
      return await this.overrideScheduleRepo.save({
        ...existing,
        ...overrideDto,
      });
    }

    // 없다면 새로 생성
    const newOverride = this.overrideScheduleRepo.create(overrideDto);
    return await this.overrideScheduleRepo.save(newOverride);
  }

  async getOverrideSchedule(filter: QueryOverrideScheduleDto) {
    const { grade, periodId, date_from, date_to }: QueryOverrideScheduleDto =
      filter;
    const query = this.overrideScheduleRepo.createQueryBuilder('override');

    // console.log(grade, study_type, date_from, date_to, "test");

    if (filter.date_from !== undefined) {
      query.andWhere('override.date >= :dateFrom', { dateFrom: date_from });
    }

    if (filter.date_to !== undefined) {
      query.andWhere('override.date <= :dateTo', { dateTo: date_to });
    }

    if (filter.grade !== undefined) {
      query.andWhere('override.grade = :grade', { grade });
    }

    if (filter.periodId !== undefined) {
      query.andWhere('override.periodId = :periodId', { periodId });
    }

    query.orderBy('override.date', 'ASC');
    return await query.getMany();
  }

  async deleteOverrideSchedule(date: string): Promise<DeleteResult> {
    return await this.overrideScheduleRepo.delete({ date });
  }
}
