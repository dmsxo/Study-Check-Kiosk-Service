import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TypeSchedule } from '../type-schedule.dto';

export class UpdateOverrideScheduleDto {
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsArray()
  @IsString({ each: true })
  descriptions: string[];

  @ValidateNested()
  @Type(() => TypeSchedule)
  targets: TypeSchedule;
}
