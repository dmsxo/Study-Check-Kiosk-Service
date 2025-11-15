import { IsString } from 'class-validator';

export class RangeDto {
  @IsString()
  start: string;

  @IsString()
  end: string;
}
