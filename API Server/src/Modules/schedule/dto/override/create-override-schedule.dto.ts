import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsString,
  IsArray,
  IsDateString,
} from 'class-validator';
import { StudyType } from 'src/common/enums/study-type.enum';

export class CreateOverrideScheduleDto {
  @IsInt()
  grade: number; // 1, 2, 3

  @IsEnum(StudyType)
  studyType: StudyType;

  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsArray()
  @IsString({ each: true })
  descriptions: string[];

  @IsBoolean()
  isOpen: boolean;
}
