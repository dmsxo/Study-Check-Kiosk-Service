import { IsNotEmpty, IsString } from 'class-validator';

export class RangeDto {
  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;
}
