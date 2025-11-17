import { IsBoolean, IsEnum, IsInt } from 'class-validator';
import { StudyType } from 'src/common/enums/study-type.enum';
import { Weekday } from 'src/common/enums/weekday.enum';

export class CreateDefaultScheduleDto {
  @IsInt()
  grade: number; // 1, 2, 3

  @IsEnum(StudyType)
  studyType: StudyType;

  @IsEnum(Weekday)
  weekday: Weekday;

  @IsBoolean()
  isOpen: boolean;
}
