import {
  IsString,
  IsArray,
  IsDateString,
  ValidateNested,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOverrideScheduleDto {
  @IsInt()
  grade: number;

  @IsDateString()
  date: string; // "2026-05-15"

  @IsBoolean()
  isOpen: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  descriptions?: string[];

  @IsInt()
  periodId: number;
}
