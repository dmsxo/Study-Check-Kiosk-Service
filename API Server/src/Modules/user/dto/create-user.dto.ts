import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  student_id: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  description?: string;
}
