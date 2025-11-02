// src/attendance/attendance.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ResponseAttendanceDto } from './dto/response-attendance.dto';
import { plainToInstance } from 'class-transformer';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(
    @Body() dto: CreateAttendanceDto,
  ): Promise<ResponseAttendanceDto> {
    const attendance = await this.attendanceService.create(dto);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<ResponseAttendanceDto[]> {
    const attendances = await this.attendanceService.findAll();
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseAttendanceDto> {
    const attendance = await this.attendanceService.findOne(id);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ): Promise<ResponseAttendanceDto> {
    const attendance = await this.attendanceService.update(id, dto);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseAttendanceDto> {
    const attendance = await this.attendanceService.remove(id);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }
}
