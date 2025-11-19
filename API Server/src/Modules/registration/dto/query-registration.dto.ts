import { IsInt, IsNotEmpty } from 'class-validator';

export class QueryRegistrationDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  periodId: number;
}
