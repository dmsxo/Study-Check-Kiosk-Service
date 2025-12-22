import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GradeSchedule } from './grade-schedule.dto';

// 아침/야간 타입별 스케줄
export class TypeSchedule {
  @ValidateNested()
  @Type(() => GradeSchedule)
  morning: GradeSchedule;

  @ValidateNested()
  @Type(() => GradeSchedule)
  night: GradeSchedule;
}
