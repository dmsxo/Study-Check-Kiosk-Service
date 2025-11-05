import { Expose, Transform } from 'class-transformer';

export class ResponseAttendanceDto {
  @Expose()
  id: number;

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

  @Expose()
  @Transform(({ obj }) => obj.student_id?.id)
  student_id: number;
}
