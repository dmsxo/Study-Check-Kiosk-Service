// src/attendance/dto/query-attendance.dto.ts
import { IsOptional, IsDateString, IsString } from 'class-validator';

export class QueryAttendanceDto {
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsString()
  type?: 'morning' | 'night';

  @IsOptional()
  @IsString()
  student_id_like?: string; // 여기에 와일드카드 문자열 입력
}
