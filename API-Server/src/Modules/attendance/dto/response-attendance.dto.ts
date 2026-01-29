import { Expose, Transform } from 'class-transformer';

export class ResponseAttendanceDto {
  @Expose()
  @Transform(({ obj }) => obj?.period?.name ?? undefined)
  type?: string; // (호환용) period.name을 type처럼 사용

  @Expose()
  id?: number;

  @Expose()
  date: string;

  @Expose()
  check_in_time?: string;

  @Expose()
  check_out_time?: string;

  @Expose()
  description?: string;

  @Expose()
  @Transform(({ obj }) => obj?.period?.id ?? undefined)
  periodId?: number;

  @Expose()
  @Transform(({ obj }) => obj?.period?.name ?? undefined)
  periodName?: string;
}
