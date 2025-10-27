import { Body, Controller, Param, Post } from '@nestjs/common';
import { StudyService } from './study.service';

@Controller('users/:id/study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post('checkin')
  check_in(@Param('id') id: number, @Body() attendanceData) {}

  @Post('checkout')
  check_out(@Param('id') id: number, @Body() attendanceData) {}
}
