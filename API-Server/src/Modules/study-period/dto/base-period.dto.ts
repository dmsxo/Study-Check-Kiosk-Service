import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { RangeDto } from 'src/common/dto/range.dto';

export class BasePeriodDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RangeDto)
  registration: RangeDto;

  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @Type(() => RangeDto)
  additionalRegistration?: RangeDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RangeDto)
  operation: RangeDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RangeDto)
  dailyOperation: RangeDto;
}
