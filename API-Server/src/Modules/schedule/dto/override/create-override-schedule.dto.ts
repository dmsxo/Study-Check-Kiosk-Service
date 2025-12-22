import {
  IsString,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { TypeSchedule } from '../type-schedule.dto';
import { Type } from 'class-transformer';

export class CreateOverrideScheduleDto {
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsArray()
  @IsString({ each: true })
  descriptions: string[];

  @ValidateNested()
  @Type(() => TypeSchedule)
  targets: TypeSchedule;
}
