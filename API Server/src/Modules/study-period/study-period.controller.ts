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
import { StudyPeriodService } from './study-period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { StudyPeriod } from './entities/period.entity';
import { QueryPeriodDto } from './dto/query-period.dto';
import { DeleteResult } from 'typeorm';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Controller('study-period')
export class StudyPeriodController {
  constructor(private readonly studyPeriodService: StudyPeriodService) {}

  @Post()
  async createPeriod(
    @Body() periodData: CreatePeriodDto,
  ): Promise<StudyPeriod[]> {
    return await this.studyPeriodService.createPeriod(periodData);
  }

  @Get()
  async getPeriodsByFilter(@Query() filter: QueryPeriodDto) {
    return await this.studyPeriodService.getPeriodsByFilter(filter);
  }

  @Get(':id')
  async getPeriodById(@Param('id') id: number): Promise<StudyPeriod> {
    return await this.studyPeriodService.getPeriodById(id);
  }

  @Patch()
  async updatePeriods(@Body() data: UpdatePeriodDto) {
    return await this.studyPeriodService.updatePeriods(data);
  }

  @Delete()
  async deletePeriods(@Query() filter: QueryPeriodDto): Promise<DeleteResult> {
    return await this.studyPeriodService.deletePeriods(filter);
  }
}
