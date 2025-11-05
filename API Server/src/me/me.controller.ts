import { Controller, Get } from '@nestjs/common';
import { MeService } from './me.service';
import { Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(
    private readonly meService: MeService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async get_me(@Req() req: Request) {
    const userId: number = req.session.user!.id;
    return this.userService.get_user(userId);
  }

  @Get('attendances')
  getMyAttendances() {}

  @Get('attendances/status')
  getMyCurrentStudyStatus() {}

  @Get('current-study')
  getMyIsStudy() {}
}
