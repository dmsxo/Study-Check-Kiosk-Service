import { PartialType } from '@nestjs/mapped-types';
import { CreateDefaultScheduleDto } from './create-default-schedule.dto';

export class UpdateDefaultScheduleDto extends PartialType(
  CreateDefaultScheduleDto,
) {}
