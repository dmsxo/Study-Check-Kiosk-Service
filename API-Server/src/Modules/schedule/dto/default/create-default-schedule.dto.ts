import { IsBoolean, IsEnum, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Weekday } from 'src/common/enums/weekday.enum';
// 요일별 스케줄
export class CreatePeriodScheduleDto {
  @IsInt()
  grade: number;

  @IsEnum(Weekday)
  weekday: Weekday;

  @IsBoolean()
  isOpen: boolean;
}
