import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  studentId?: number;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // 기본값: student

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  profileImageFilename?: string;
}
