import { IsEnum, IsOptional } from 'class-validator';
import { RegistrationStatus } from 'src/common/enums/registration-status.enum';

export class UpdateRegistrationDto {
  @IsEnum(RegistrationStatus)
  status: RegistrationStatus; // active, cancelled, removed
}
