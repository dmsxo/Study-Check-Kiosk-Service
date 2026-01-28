import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudyPeriod } from './period.entity';

@Entity('grade_capacitys')
export class GradeCapacity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  grade: number;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column()
  periodId: number;

  @ManyToOne(() => StudyPeriod, (period: StudyPeriod) => period.capacities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'periodId' })
  period: StudyPeriod;
}
