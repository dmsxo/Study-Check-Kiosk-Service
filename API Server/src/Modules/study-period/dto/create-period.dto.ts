import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StudyType } from 'src/common/enums/study-type.enum';
import { BasePeriodDto } from './base-period.dto';
import { GradeCapacityPair } from './grade-capacity.dto';

export class CreatePeriodDto extends BasePeriodDto {
  @IsInt()
  termId: number;

  @IsNotEmpty()
  @IsEnum(StudyType)
  studyType: StudyType;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => GradeCapacityPair)
  grades: GradeCapacityPair[];
}
