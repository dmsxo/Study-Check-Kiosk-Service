import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { StudyType } from 'src/common/enums/study-type.enum';

export class QueryPeriodDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  term_id: number;

  @IsOptional()
  @IsEnum(StudyType)
  study_type: StudyType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  relation: boolean;

  @IsOptional()
  @IsDateString()
  active_from: string;

  @IsOptional()
  @IsDateString()
  active_to: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  grade: number;
}
