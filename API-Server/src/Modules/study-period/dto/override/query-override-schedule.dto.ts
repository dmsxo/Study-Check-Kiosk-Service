import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
export class QueryOverrideScheduleDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  grade?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  periodId?: number;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;
}
