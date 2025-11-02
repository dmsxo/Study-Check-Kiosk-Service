import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  student_id: number;

  @IsNotEmpty()
  @IsString()
  type: string; // morning, evening

  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsOptional()
  check_in_time?: string; // HH:MM:SS

  @IsOptional()
  check_out_time?: string;

  @IsOptional()
  description?: string;
}
