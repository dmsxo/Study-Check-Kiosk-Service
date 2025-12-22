import { Column } from 'typeorm';

export class DateRange {
  @Column({ type: 'date' })
  start: string;

  @Column({ type: 'date' })
  end: string;
}
