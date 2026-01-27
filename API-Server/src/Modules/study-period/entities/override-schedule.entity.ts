import { StudyPeriod } from 'src/Modules/study-period/entities/period.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PeriodOverrideMap } from './period-override-map.entity';

@Entity('override_schedules')
export class OverrideSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  date: string;

  @Column({ type: 'text', array: true, nullable: true })
  descriptions: string[];

  @OneToMany(() => PeriodOverrideMap, (map) => map.event, { cascade: true })
  mappings: PeriodOverrideMap[];
}
