// src/attendance/dto/create-attendance.dto.ts
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  type: string; // morning, evening

  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsDateString()
  check_in_time: string; // HH:MM:SS

  @IsOptional()
  @IsDateString()
  check_out_time?: string; // HH:MM:SS

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  student_id: string; // User student_id
}
