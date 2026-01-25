import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BasePeriodDto } from './base-period.dto';
import { GradeCapacityPair } from './grade-capacity.dto';
import { CreatePeriodScheduleDto } from 'src/Modules/schedule/dto/default/create-default-schedule.dto';

export class CreatePeriodDto extends BasePeriodDto {
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => GradeCapacityPair)
  capacities: GradeCapacityPair[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreatePeriodScheduleDto)
  schedules: CreatePeriodScheduleDto[];
}
