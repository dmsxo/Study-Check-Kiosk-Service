import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  studentId: number;

  // @IsEmail()
  // @IsString()
  // email: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  profileImageFilename?: string;
}
