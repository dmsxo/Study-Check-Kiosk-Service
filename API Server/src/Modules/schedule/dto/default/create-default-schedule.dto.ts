import { IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 학년별 스케줄
export class GradeSchedule {
  @IsBoolean()
  grade1: boolean;

  @IsBoolean()
  grade2: boolean;

  @IsBoolean()
  grade3: boolean;
}

// 아침/야간 타입별 스케줄
export class TypeSchedule {
  @ValidateNested()
  @Type(() => GradeSchedule)
  morning: GradeSchedule;

  @ValidateNested()
  @Type(() => GradeSchedule)
  night: GradeSchedule;
}

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
