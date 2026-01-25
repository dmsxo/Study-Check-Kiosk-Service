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
import { ScheduleService } from './schedule.service';
import { CreatePeriodScheduleDto } from './dto/default/create-default-schedule.dto';
import { PeriodSchedule } from './entities/period-schedule.entity';
import { UpdatePeriodScheduleDto } from './dto/default/update-default-schedule.dto';
import { CreateOverrideScheduleDto } from './dto/override/create-override-schedule.dto';
import { UpdateOverrideScheduleDto } from './dto/override/update-override-schedule.dto';
import { QueryOverrideScheduleDto } from './dto/override/query-override-schedule.dto';
import { DeleteResult } from 'typeorm';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // default schedule
  @Post('default')
  async createPeriodSchedule(@Body() weekSchedule: CreatePeriodScheduleDto) {
    return await this.scheduleService.createPeriodSchedule(weekSchedule);
  }

  @Get('default')
  async getPeriodSchedule(): Promise<PeriodSchedule[]> {
    return await this.scheduleService.getPeriodSchedule();
  }

  @Patch('default')
  async updatePeriodSchedule(@Body() weekSchedule: UpdatePeriodScheduleDto) {
    return await this.scheduleService.updatePeriodSchedule(weekSchedule);
  }

  @Delete('default/:id')
  async deletePeriodSchedule(@Param('id') id: number) {
    return await this.scheduleService.deletePeriodSchedule(id);
  }

  // override schedule
  @Post('override')
  async createOverrideSchedule(@Body() overrideDto: CreateOverrideScheduleDto) {
    return await this.scheduleService.createOverrideSchedule(overrideDto);
  }

  @Get('override')
  async getOverrideSchedule(@Query() queryDto: QueryOverrideScheduleDto) {
    return await this.scheduleService.getOverrideSchedule(queryDto);
  }

  @Patch('override')
  async updateOverrideSchedule(@Body() filter: UpdateOverrideScheduleDto) {
    return await this.scheduleService.updateOverrideSchedule(filter);
  }

  @Delete('override')
  async deleteOverrideSchedule(
    @Query('date') date: string,
  ): Promise<DeleteResult> {
    return await this.scheduleService.deleteOverrideSchedule(date);
  }

  @Get()
  async getAvailableDates() {}
}
