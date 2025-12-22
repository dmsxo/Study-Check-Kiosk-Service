import { IsEmail, IsInt, IsNumber, IsString } from 'class-validator';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Expose, Exclude } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  @IsInt()
  id: number;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsNumber()
  studentId: number;
  // @Expose()
  // @IsString()
  // @IsEmail()
  // email: string;

  @Expose()
  @IsString()
  description?: string;

  @Expose()
  @IsString()
  profileImageFilename?: string;

  @Exclude()
  attendances?: Attendance[];
}
