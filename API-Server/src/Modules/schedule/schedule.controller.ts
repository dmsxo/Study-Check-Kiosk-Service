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
import { CreateDefaultScheduleDto } from './dto/default/create-default-schedule.dto';
import { DefaultSchedule } from './entities/period-schedule.entity';
import { UpdateDefaultScheduleDto } from './dto/default/update-default-schedule.dto';
import { CreateOverrideScheduleDto } from './dto/override/create-override-schedule.dto';
import { UpdateOverrideScheduleDto } from './dto/override/update-override-schedule.dto';
import { QueryOverrideScheduleDto } from './dto/override/query-override-schedule.dto';
import { DeleteResult } from 'typeorm';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // default schedule
  @Post('default')
  async createDefaultSchedule(@Body() weekSchedule: CreateDefaultScheduleDto) {
    return await this.scheduleService.createDefaultSchedule(weekSchedule);
  }

  @Get('default')
  async getDefaultSchedule(): Promise<DefaultSchedule[]> {
    return await this.scheduleService.getDefaultSchedule();
  }

  @Patch('default')
  async updateDefaultSchedule(@Body() weekSchedule: UpdateDefaultScheduleDto) {
    return await this.scheduleService.updateDefaultSchedule(weekSchedule);
  }

  @Delete('default/:id')
  async deleteDefaultSchedule(@Param('id') id: number) {
    return await this.scheduleService.deleteDefaultSchedule(id);
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
