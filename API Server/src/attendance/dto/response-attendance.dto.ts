// src/attendance/dto/response-attendance.dto.ts
import { Attendance } from '../entities/attendance.entity';

export class ResponseAttendanceDto {
  id: number;
  type: 'morning' | 'night';
  date: string;
  check_in_time: Date;
  check_out_time?: Date;
  description?: string;

  constructor(attendance: Attendance) {
    this.id = attendance.id;
    this.type = attendance.type as 'morning' | 'night';
    this.date = attendance.date;
    this.check_in_time = attendance.check_in_time;
    this.check_out_time = attendance.check_out_time;
    this.description = attendance.description;
  }
}
