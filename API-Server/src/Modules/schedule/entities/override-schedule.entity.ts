import { StudyPeriod } from 'src/Modules/study-period/entities/period.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('override_schedules')
@Unique(['grade', 'studyType', 'date'])
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

  @ManyToOne(() => StudyPeriod, (period) => period.schedule, {
    onDelete: 'CASCADE',
  })
  period: StudyPeriod;
}
