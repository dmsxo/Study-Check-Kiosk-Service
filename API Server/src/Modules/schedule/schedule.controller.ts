import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // default schedule
  @Post('default')
  async createDefaultSchedule() {}

  @Get('default')
  async getDefaultSchedule() {}

  @Patch('default')
  async updateDefaultSchedule() {}

  @Delete('default')
  async deleteDefaultSchedule() {}

  // override schedule
  @Post('override')
  async createOverrideSchedule() {}

  @Get('override')
  async getOverrideSchedule() {}

  @Patch('override')
  async updateOverrideSchedule() {}

  @Delete('override')
  async deleteOverrideSchedule() {}
}
