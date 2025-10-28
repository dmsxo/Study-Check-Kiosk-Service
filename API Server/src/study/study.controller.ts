import { Controller, Param, Post, Query } from '@nestjs/common';
import { StudyService } from './study.service';

@Controller('users/:id/study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Post('checkin/:studyType')
  check_in(@Param('id') id: number, @Param('studyType') studyType) {
    this.studyService.check_in(id, studyType);
  }

  @Post('checkout/:studyType')
  check_out(
    @Param('id') id: number,
    @Param('studyType') studyType,
    @Query('description') description?: string,
  ) {
    this.studyService.check_out(id, studyType, description ?? '');
  }
}
