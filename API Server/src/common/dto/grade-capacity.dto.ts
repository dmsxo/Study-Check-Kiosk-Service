import { IsInt, IsOptional } from 'class-validator';

export class GradeCapacityDto {
  @IsOptional()
  @IsInt()
  grade1?: number;

  @IsOptional()
  @IsInt()
  grade2?: number;

  @IsOptional()
  @IsInt()
  grade3?: number;
}
