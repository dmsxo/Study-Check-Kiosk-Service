import { DateRange } from 'src/common/entities/date-range.entity';
import { TimeRange } from 'src/common/entities/time-range.entity';
import { Registration } from 'src/Modules/registration/entities/registration.entity';
import { PeriodSchedule } from 'src/Modules/study-period/entities/period-schedule.entity';

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GradeCapacity } from './grade-capacity.entity';
import { PeriodOverrideMap } from './period-override-map.entity';

@Entity('study_periods')
export class StudyPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column(() => DateRange)
  registration: DateRange;

  @Column({ type: 'jsonb', nullable: true })
  additionalRegistration?: DateRange[];

  @Column(() => DateRange)
  operation: DateRange;

  @Column(() => TimeRange)
  dailyOperation: TimeRange;

  @OneToMany(() => GradeCapacity, (capacities) => capacities.period)
  capacities?: GradeCapacity[];

  @OneToMany(() => Registration, (registration) => registration.period)
  registrations?: Registration[];

  @OneToMany(() => PeriodSchedule, (schedules) => schedules.period)
  schedules?: PeriodSchedule[];

  @OneToMany(() => PeriodOverrideMap, (override) => override.period)
  override?: PeriodOverrideMap[];
}
