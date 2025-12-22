import { IsBoolean } from "class-validator";

export class GradeSchedule {
  @IsBoolean()
  grade1: boolean;

  @IsBoolean()
  grade2: boolean;

  @IsBoolean()
  grade3: boolean;
}