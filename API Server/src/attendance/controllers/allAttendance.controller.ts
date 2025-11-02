// src/attendance/controllers/all-attendance.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { AttendanceService } from '../attendance.service';
import { QueryAttendanceDto } from '../dto/query-attendance.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseAttendanceDto } from '../dto/response-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';

@Controller('attendances')
export class AllAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async getAll(@Query() query: QueryAttendanceDto) {
    const attendances = await this.attendanceService.findAll(query);
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const attendance = await this.attendanceService.findOneById(id);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':attendanceId')
  async update(
    @Param('attendanceId', ParseIntPipe) attendanceId: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    const attendance = await this.attendanceService.update(attendanceId, dto);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':attendanceId')
  async remove(@Param('attendanceId', ParseIntPipe) attendanceId: number) {
    const attendance = await this.attendanceService.remove(attendanceId);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }
}
