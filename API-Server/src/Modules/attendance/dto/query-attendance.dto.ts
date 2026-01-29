// src/attendance/dto/query-attendance.dto.ts
import { IsOptional, IsDateString, IsString, IsInt } from 'class-validator';
export class QueryAttendanceDto {
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  // @IsOptional()
  // @IsEnum(StudyType)
  // type?: StudyType;

  @IsOptional()
  @IsInt()
  periodId?: number;

  @IsOptional()
  @IsString()
  studentId_like?: string; // 여기에 와일드카드 문자열 입력
}
