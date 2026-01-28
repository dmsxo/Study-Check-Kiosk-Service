import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OverrideService } from '../service/override.service';
import { CreatePeriodScheduleDto } from '../dto/default/create-default-schedule.dto';
import { PeriodSchedule } from '../entities/period-schedule.entity';
import { UpdatePeriodScheduleDto } from '../dto/default/update-default-schedule.dto';
import { QueryOverrideScheduleDto } from '../dto/override/query-override-schedule.dto';
import { DeleteResult } from 'typeorm';
import { CreateOverrideBatchDto } from '../dto/override/create-override-schedule.dto';

@Controller('overrides')
export class OverrideController {
  constructor(private readonly overrideService: OverrideService) {}

  @Get('')
  async get(@Query() query: QueryOverrideScheduleDto) {
    return await this.overrideService.getOverrideSchedule(query);
  }

  @Post('')
  async createBatch(@Body() dto: CreateOverrideBatchDto) {
    return await this.overrideService.upsertOverrideBatch(dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.overrideService.deleteEvent(id);
  }
}
