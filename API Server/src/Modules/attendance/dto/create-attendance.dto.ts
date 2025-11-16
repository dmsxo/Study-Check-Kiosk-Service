import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';
import { StudyType } from 'src/common/enums/study-type.enum';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsInt()
  student_id: number;

  @IsNotEmpty()
  @IsEnum(StudyType)
  type: StudyType; // morning, evening

  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsNotEmpty()
  check_in_time: string; // HH:MM:SS

  @IsOptional()
  check_out_time?: string;

  @IsOptional()
  description?: string;
}
