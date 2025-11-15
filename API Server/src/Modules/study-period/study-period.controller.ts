import { Controller, Post } from '@nestjs/common';
import { StudyPeriodService } from './study-period.service';

@Controller('study-period')
export class StudyPeriodController {
  constructor(private readonly studyPeriodService: StudyPeriodService) {}
}
