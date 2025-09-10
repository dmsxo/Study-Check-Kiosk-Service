import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyController } from './study.controller';

@Module({
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
