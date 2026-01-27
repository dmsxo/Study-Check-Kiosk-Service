import { StudyPeriod } from 'src/Modules/study-period/entities/period.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('override_schedules')
@Unique(['grade', 'periodId', 'date'])
export class OverrideSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  grade: number; // 1, 2, 3

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', array: true, nullable: true })
  descriptions: string[];

  @Column()
  isOpen: boolean;

  @Column()
  periodId: number;

  @ManyToOne(() => StudyPeriod, (period) => period.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'periodId' })
  period: StudyPeriod;
}
