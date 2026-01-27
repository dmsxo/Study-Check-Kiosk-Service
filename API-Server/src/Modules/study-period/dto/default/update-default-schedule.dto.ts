import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodScheduleDto } from './create-default-schedule.dto';

export class UpdatePeriodScheduleDto extends PartialType(
  CreatePeriodScheduleDto,
) {}
