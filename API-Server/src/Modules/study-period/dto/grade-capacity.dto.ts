import { IsInt, IsOptional } from 'class-validator';
export class GradeCapacityPair {
  @IsInt()
  grade: number;

  @IsOptional()
  @IsInt()
  capacity?: number;
}
