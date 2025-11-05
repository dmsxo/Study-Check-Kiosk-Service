import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  student_id: number;

  @IsEmail()
  email: string;
}
