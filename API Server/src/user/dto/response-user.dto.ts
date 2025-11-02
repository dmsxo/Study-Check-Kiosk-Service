import { Attendance } from '../../attendance/entities/attendance.entity';

export class ResponseUserDto {
  id: number;
  name: string;
  student_id: number;
  email: string;
  attendances?: Attendance[];
}
