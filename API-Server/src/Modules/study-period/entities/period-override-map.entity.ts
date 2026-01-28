import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { StudyPeriod } from './period.entity';
import { OverrideSchedule } from './override-schedule.entity';

@Entity()
@Unique(['periodId', 'eventId', 'grade'])
export class PeriodOverrideMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  periodId: number;

  @Column()
  eventId: number;

  @Column()
  grade: number;

  @Column({ default: false })
  isOpen: boolean; // 프로그램별/학년별 운영 여부 핵심 필드

  @ManyToOne(() => StudyPeriod, (period: StudyPeriod) => period.override, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'periodId' })
  period: StudyPeriod;

  @ManyToOne(() => OverrideSchedule, (e) => e.mappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: OverrideSchedule;
}
