import { IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @IsNotEmpty()
  @IsInt()
  periodId: number;

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
