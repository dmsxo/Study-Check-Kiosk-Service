import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GradeCapacityDto } from 'src/common/dto/grade-capacity.dto';
import { RangeDto } from 'src/common/dto/range.dto';
import { StudyType } from 'src/common/enums/study-type.enum';

export class CreatePeriodDto {
  @IsString()
  name: string;

  @IsNumber()
  grade: number;

  @IsString()
  @IsEnum(StudyType)
  studyType: StudyType;

  @ValidateNested()
  @Type(() => RangeDto)
  registration: RangeDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => RangeDto)
  additionalRegistration: RangeDto;

  @ValidateNested()
  @Type(() => RangeDto)
  operation: RangeDto;

  @ValidateNested()
  @Type(() => RangeDto)
  dailyOperation: RangeDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => GradeCapacityDto)
  capacity?: GradeCapacityDto;
}
