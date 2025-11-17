import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DefaultSchedule } from './entities/default-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OverrideSchedule } from './entities/override-schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(DefaultSchedule)
    private readonly defaultScheduleRepo: Repository<DefaultSchedule>,

    @InjectRepository(OverrideSchedule)
    private readonly overrideScheduleRepo: Repository<OverrideSchedule>,
  ) {}

  // default schedule
  async createDefaultSchedule() {}

  async getDefaultSchedule() {}

  async updateDefaultSchedule() {}

  async deleteDefaultSchedule() {}

  // override schedule
  async createOverrideSchedule() {}

  async getOverrideSchedule() {}

  async updateOverrideSchedule() {}

  async deleteOverrideSchedule() {}
}
