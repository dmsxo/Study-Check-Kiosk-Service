import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CheckInDto {
  @IsInt()
  periodId: number;

  @IsOptional()
  @IsInt()
  ttl?: number;

  @IsBoolean()
  isAutoCheckOut: boolean;
}
