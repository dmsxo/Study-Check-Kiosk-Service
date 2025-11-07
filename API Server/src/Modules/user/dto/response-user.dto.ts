import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Expose, Exclude } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsNumber()
  student_id: number;
  @Expose()
  @IsString()
  @IsEmail()
  email: string;
  @Exclude()
  attendances?: Attendance[];
}
