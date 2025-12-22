import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeSchedule } from '../type-schedule.dto';

// 요일별 스케줄
export class CreateDefaultScheduleDto {
  @ValidateNested()
  @Type(() => TypeSchedule)
  SUN: TypeSchedule;

  @ValidateNested()
  @Type(() => TypeSchedule)
  MON: TypeSchedule;

  @ValidateNested()
  @Type(() => TypeSchedule)
  TUES: TypeSchedule;

  @ValidateNested()
  @Type(() => TypeSchedule)
  WED: TypeSchedule;

  @ValidateNested()
  @Type(() => TypeSchedule)
  THUR: TypeSchedule;

  @ValidateNested()
  @Type(() => TypeSchedule)
  FRI: TypeSchedule;

  @ValidateNested()
  @Type(() => TypeSchedule)
  SAT: TypeSchedule;
}
