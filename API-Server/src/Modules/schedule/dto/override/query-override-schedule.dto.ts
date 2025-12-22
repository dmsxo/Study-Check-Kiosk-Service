import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { StudyType } from 'src/common/enums/study-type.enum';

export class QueryOverrideScheduleDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  grade?: number;

  @IsOptional()
  @IsEnum(StudyType)
  study_type?: StudyType;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;
}
