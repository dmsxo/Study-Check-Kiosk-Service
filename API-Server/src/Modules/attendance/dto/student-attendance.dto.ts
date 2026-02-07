import { ResponseAttendanceDto } from './response-attendance.dto';

export class StudentAttendanceDto {
  studentId: number;
  studentName: string;
  totalCount: number;
  attendances: ResponseAttendanceDto[];
}
