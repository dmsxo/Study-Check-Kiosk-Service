import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
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
  @Type(() => Number)
  @IsInt()
  grade: number;
}
