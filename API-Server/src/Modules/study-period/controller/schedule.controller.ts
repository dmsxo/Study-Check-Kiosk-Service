import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleService } from '../service/schedule.service';
import { CreatePeriodScheduleDto } from '../dto/default/create-default-schedule.dto';
import { PeriodSchedule } from '../entities/period-schedule.entity';
import { UpdatePeriodScheduleDto } from '../dto/default/update-default-schedule.dto';
import { CreateOverrideScheduleDto } from '../dto/override/create-override-schedule.dto';
import { QueryOverrideScheduleDto } from '../dto/override/query-override-schedule.dto';
import { DeleteResult } from 'typeorm';

@Controller('study-period/override-schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  // override schedule
  @Post()
  async createOverrideSchedule(@Body() overrideDto: CreateOverrideScheduleDto) {
    return await this.scheduleService.createOverrideSchedule(overrideDto);
  }

  @Get()
  async getOverrideSchedule(@Query() queryDto: QueryOverrideScheduleDto) {
    return await this.scheduleService.getOverrideSchedule(queryDto);
  }

  @Delete()
  async deleteOverrideSchedule(
    @Query('date') date: string,
  ): Promise<DeleteResult> {
    return await this.scheduleService.deleteOverrideSchedule(date);
  }

  @Get()
  async getAvailableDates() {}
}
