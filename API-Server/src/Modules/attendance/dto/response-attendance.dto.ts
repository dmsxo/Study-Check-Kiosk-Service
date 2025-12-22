import { Expose } from 'class-transformer';

export class ResponseAttendanceDto {
  @Expose()
  type: string;

  @Expose()
  date: string;

  @Expose()
  check_in_time?: string;

  @Expose()
  check_out_time?: string;

  @Expose()
  description?: string;
}
