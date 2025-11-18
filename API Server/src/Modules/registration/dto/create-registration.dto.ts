import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { RegistrationStatus } from 'src/common/enums/registration-status.enum';

export class CreateRegistrationDto {
  @IsInt()
  studentId: number; // User 엔티티의 id

  @IsInt()
  periodId: number; // StudyPeriod 엔티티의 id

  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus; // 기본값은 active
}
