import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { StudyPeriod } from './period.entity';

export class GradeCapacity {
  @Column({ type: 'int' })
  grade: number;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column()
  periodId: number;

  @ManyToOne(() => StudyPeriod, (period: StudyPeriod) => period.capacity)
  @JoinColumn({ name: 'periodId' })
  period: StudyPeriod;
}
