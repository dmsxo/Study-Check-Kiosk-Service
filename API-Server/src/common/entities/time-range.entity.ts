import { Column } from 'typeorm';

export class TimeRange {
  @Column({ type: 'time' })
  start: Date;

  @Column({ type: 'time' })
  end: Date;
}
