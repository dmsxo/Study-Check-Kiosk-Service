// src/attendance/controllers/user-attendance.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { AttendanceService } from '../attendance.service';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';
import { QueryAttendanceDto } from '../dto/query-attendance.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseAttendanceDto } from '../dto/response-attendance.dto';
import { Attendance } from '../entities/attendance.entity';

@Controller('users/:userId/attendances')
export class UserAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async getAllByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: QueryAttendanceDto,
  ) {
    const attendances = await this.attendanceService.findAllByStudent(
      userId,
      query,
    );
    return plainToInstance(ResponseAttendanceDto, attendances, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateAttendanceDto,
  ) {
    dto.student_id = userId;
    const attendance = await this.attendanceService.create(dto);
    return plainToInstance(ResponseAttendanceDto, attendance, {
      excludeExtraneousValues: true,
    });
  }

  @Post('check-in')
  async checkIn(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('type') type: 'morning' | 'night',
  ): Promise<Attendance> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return this.attendanceService.checkIn(userId, type);
  }

  // 체크아웃
  @Post('check-out')
  async checkOut(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('type') type: 'morning' | 'night',
    @Query('description') description?: string,
  ): Promise<Attendance> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return this.attendanceService.checkOut(userId, type, description ?? '');
  }
}
