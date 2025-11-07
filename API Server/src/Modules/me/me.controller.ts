import { Controller, Get } from '@nestjs/common';
import { MeService } from './me.service';
import { Req, UseGuards, Query, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/Modules/auth/auth.guard';
import { ResponseAttendanceDto } from '../attendance/dto/response-attendance.dto';
import { Post } from '@nestjs/common';

@Controller('me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async get_me(@Req() req: Request) {
    return await this.meService.getMyProfile(req.session.user!.id);
  }

  @Get('attendances')
  async getMyAttendances(
    @Req() req: Request,
  ): Promise<ResponseAttendanceDto[] | null> {
    return await this.meService.getMyAttendances(req.session.user!.id);
  }

  @Get('attendances/current')
  async getCurrentStudyStatus(
    @Req() req: Request,
    @Query('type') type: 'morning' | 'night',
  ): Promise<ResponseAttendanceDto | null> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return await this.meService.getCurrentStudyStatus(
      req.session.user!.id,
      type,
    );
  }

  // 체크인
  @Post('attendances/check-in')
  async checkIn(
    @Req() req: Request,
    @Query('type') type: 'morning' | 'night',
  ): Promise<ResponseAttendanceDto | null> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return await this.meService.checkIn(req.session.user!.id, type);
  }

  // 체크아웃
  @Post('attendances/check-out')
  async checkOut(
    @Req() req: Request,
    @Query('type') type: 'morning' | 'night',
    @Query('description') description?: string,
  ): Promise<ResponseAttendanceDto | null> {
    if (!['morning', 'night'].includes(type))
      throw new BadRequestException('Invalid type');
    return await this.meService.checkOut(
      req.session.user!.id,
      type,
      description ?? '',
    );
  }
}
