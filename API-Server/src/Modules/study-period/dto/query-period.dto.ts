import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryPeriodDto {
  @IsOptional()
  @IsString()
  name: string;

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
