import { IsEmail, IsInt, IsNumber, IsString } from 'class-validator';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Expose, Exclude } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';

export class ResponseUserDto {
  @Expose()
  @IsInt()
  id: number;
  @Expose()
  @IsString()
  name: string;

  @Expose()
  role: UserRole;

  @Expose()
  @IsNumber()
  studentId?: number;
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  description?: string;

  @Expose()
  @IsString()
  profileImageFilename?: string;

  @Exclude()
  attendances?: Attendance[];
}
