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

export class CreateOverrideBatchDto {
  @IsDateString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  descriptions?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OverrideTargetDto)
  @IsOptional()
  targets: OverrideTargetDto[];
}

export class OverrideTargetDto {
  @IsInt()
  periodId: number;

  @IsInt()
  grade: number;

  @IsBoolean()
  isOpen: boolean;
}
