import { IsInt, IsOptional, IsString } from 'class-validator';

export class CheckOutDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  ttl?: number;
}
