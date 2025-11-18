import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateDefaultScheduleDto } from './dto/default/create-default-schedule.dto';
import { Weekday } from 'src/common/enums/weekday.enum';
import { StudyType } from 'src/common/enums/study-type.enum';
import { DefaultSchedule } from './entities/default-schedule.entity';
import { UpdateDefaultScheduleDto } from './dto/default/update-default-schedule.dto';

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
  async createOverrideSchedule() {
    return await this.scheduleService.createOverrideSchedule();
  }

  @Get('override')
  async getOverrideSchedule() {
    return await this.scheduleService.getOverrideSchedule();
  }

  @Patch('override')
  async updateOverrideSchedule() {
    return await this.scheduleService.updateOverrideSchedule();
  }

  @Delete('override')
  async deleteOverrideSchedule() {
    return await this.scheduleService.deleteOverrideSchedule();
  }
}
