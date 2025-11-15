import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';
import { StudentService } from '../student.service';
import { Req, UseGuards, Query, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ResponseAttendanceDto } from '../../attendance/dto/response-attendance.dto';
import { Post } from '@nestjs/common';
import { StudyType } from 'src/common/enums/study-type.enum';
import { StudyTypePipe } from 'src/common/pipe/study-type.pipe';

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
  //   @Query('type', StudyTypePipe) type: StudyType,
  // ): Promise<ResponseAttendanceDto | null> {
  //   if (!Object.values(StudyType).includes(type))
  //     throw new BadRequestException('Invalid type');
  //   return await this.studentService.getCurrentStudyStatus(id, type);
  // }

  // 체크인
  @Post('attendances/check-in')
  async checkIn(
    @Param('id') id: number,
    @Query('type', StudyTypePipe) type: StudyType,
  ): Promise<ResponseAttendanceDto | null> {
    if (!Object.values(StudyType).includes(type as StudyType))
      throw new BadRequestException('Invalid type');
    return await this.studentService.checkIn(id, type);
  }

  // 체크아웃
  @Post('attendances/check-out')
  async checkOut(
    @Param('id') id: number,
    @Query('type', StudyTypePipe) type: StudyType,
    @Query('description') description?: string,
  ): Promise<ResponseAttendanceDto | null> {
    if (!Object.values(StudyType).includes(type as StudyType))
      throw new BadRequestException('Invalid type');
    return await this.studentService.checkOut(id, type, description ?? '');
  }
}
