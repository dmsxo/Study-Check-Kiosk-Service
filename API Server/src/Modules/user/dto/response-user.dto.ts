import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Attendance } from '../../attendance/entities/attendance.entity';

export class ResponseUserDto {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsNumber()
  student_id: number;
  @IsString()
  @IsEmail()
  email: string;
  // attendances?: Attendance[];
}
