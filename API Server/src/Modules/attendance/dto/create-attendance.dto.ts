import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { StudyType } from 'src/common/enums/study-type.enum';

export class CreateAttendanceDto {
  @IsNotEmpty()
  student_id: number;

  @IsNotEmpty()
  @IsEnum(StudyType)
  type: StudyType; // morning, evening

  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsOptional()
  check_in_time: string; // HH:MM:SS

  @IsOptional()
  check_out_time?: string;

  @IsOptional()
  description?: string;
}
