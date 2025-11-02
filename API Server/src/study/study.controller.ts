import { Controller, Param, Post, Query } from '@nestjs/common';
import { StudyService } from './study.service';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Controller('users/:id/study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post('checkin/:studyType')
  check_in(
    @Param('id') id: number,
    @Param('studyType') studyType,
  ): Promise<Attendance> {
    return this.studyService.check_in(id, studyType);
  }

  @Post('checkout/:studyType')
  check_out(
    @Param('id') id: number,
    @Param('studyType') studyType,
    @Query('description') description?: string,
  ): Promise<Attendance> {
    return this.studyService.check_out(id, studyType, description ?? '');
  }
}
