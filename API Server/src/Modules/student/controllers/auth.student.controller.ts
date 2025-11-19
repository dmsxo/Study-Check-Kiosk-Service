import {
  Body,
  Controller,
  Get,
  ParseEnumPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentService } from '../student.service';
import { Req, UseGuards, Query, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ResponseAttendanceDto } from '../../attendance/dto/response-attendance.dto';
import { Post } from '@nestjs/common';
import { StudyType } from 'src/common/enums/study-type.enum';
import { StudyTypePipe } from 'src/common/pipe/study-type.pipe';
import { CheckInDto } from '../dto/check-in.dto';
import { CheckOutDto } from '../dto/check-out.dto';

@Controller('me')
@UseGuards(AuthGuard)
export class AuthStudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async get_me(@Req() req: Request) {
    return await this.studentService.getMyProfile(req.session.user!.id);
  }

  @Get('attendances')
  async getMyAttendances(
    @Req() req: Request,
  ): Promise<ResponseAttendanceDto[] | null> {
    return await this.studentService.getMyAttendances(req.session.user!.id);
  }

  @Get('attendances/current')
  async getCurrentStudyStatus(
    @Req() req: Request,
    @Query('type', StudyTypePipe) type: StudyType,
  ): Promise<ResponseAttendanceDto | null> {
    if (!Object.values(StudyType).includes(type as StudyType))
      throw new BadRequestException('Invalid type');
    return await this.studentService.getCurrentStudyStatus(
      req.session.user!.id,
      type,
    );
  }

  // 체크인
  @Post('attendances/check-in')
  async checkIn(
    @Req() req: Request,
    @Body() checkInDto: CheckInDto,
  ): Promise<ResponseAttendanceDto | null> {
    return await this.studentService.checkIn(req.session.user!.id, checkInDto);
  }

  // 체크아웃
  @Post('attendances/check-out')
  async checkOut(
    @Req() req: Request,
    @Body() checkOutDto: CheckOutDto,
  ): Promise<ResponseAttendanceDto | null> {
    return await this.studentService.checkOut(
      req.session.user!.id,
      checkOutDto,
    );
  }
}
