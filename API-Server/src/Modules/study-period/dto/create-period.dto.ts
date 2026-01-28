import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BasePeriodDto } from './base-period.dto';
import { GradeCapacityPair } from './grade-capacity.dto';
import { CreatePeriodScheduleDto } from 'src/Modules/study-period/dto/default/create-default-schedule.dto';
import { Optional } from '@nestjs/common/decorators/core/optional.decorator';

export class CreatePeriodDto extends BasePeriodDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @Optional()
  description?: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => GradeCapacityPair)
  capacities: GradeCapacityPair[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreatePeriodScheduleDto)
  schedules: CreatePeriodScheduleDto[];
}
