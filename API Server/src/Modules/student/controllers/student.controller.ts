import { Controller, Get, Param } from '@nestjs/common';
import { StudentService } from '../student.service';
import { Req, UseGuards, Query, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ResponseAttendanceDto } from '../../attendance/dto/response-attendance.dto';
import { Post } from '@nestjs/common';

@Controller('users/:id/')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('attendances')
  async getMyAttendances(
    @Param('id') id: number,
  ): Promise<ResponseAttendanceDto[] | null> {
    return await this.studentService.getMyAttendances(id);
  }

  // @Get('attendances/current')
  // async getCurrentStudyStatus(
  //   @Param('id') id: number,
  //   @Query('type') type: 'morning' | 'night',
  // ): Promise<ResponseAttendanceDto | null> {
  //   if (!['morning', 'night'].includes(type))
  //     throw new BadRequestException('Invalid type');
  //   return await this.studentService.getCurrentStudyStatus(id, type);
  // }

  // 체크인
  @Post('attendances/check-in')
  async checkIn(
    @Param('id') id: number,
    @Query('type') type: 'morning' | 'night',
  ): Promise<ResponseAttendanceDto | null> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return await this.studentService.checkIn(id, type);
  }

  // 체크아웃
  @Post('attendances/check-out')
  async checkOut(
    @Param('id') id: number,
    @Query('type') type: 'morning' | 'night',
    @Query('description') description?: string,
  ): Promise<ResponseAttendanceDto | null> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return await this.studentService.checkOut(id, type, description ?? '');
  }
}
