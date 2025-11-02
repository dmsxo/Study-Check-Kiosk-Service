// src/attendance/dto/response-attendance.dto.ts
import { User } from '../../user/entities/user.entity';

export class ResponseAttendanceDto {
  id: number;
  type: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  description?: string;
  student?: {
    id: number;
    name: string;
    student_id: number;
    email: string;
  };
}
