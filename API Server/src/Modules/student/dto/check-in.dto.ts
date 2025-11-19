import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CheckInDto {
  @IsInt()
  periodId: number;

  @IsOptional()
  @IsBoolean()
  isAutoCheckOut?: boolean;
}
