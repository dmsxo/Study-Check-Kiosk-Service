import { IsInt, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  email: string;
}
