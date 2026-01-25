import { DateRange } from 'src/common/entities/date-range.entity';
import { TimeRange } from 'src/common/entities/time-range.entity';
import { Registration } from 'src/Modules/registration/entities/registration.entity';
import { PeriodSchedule } from 'src/Modules/schedule/entities/period-schedule.entity';
import { OverrideSchedule } from 'src/Modules/schedule/entities/override-schedule.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GradeCapacity } from './grade-capacity.entity';

@Entity('study_periods')
@Unique(['termId', 'grade', 'studyType'])
export class StudyPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column(() => DateRange)
  registration: DateRange;

  @Column({ type: 'jsonb', nullable: true })
  additionalRegistration?: DateRange[];

  @Column(() => DateRange)
  operation: DateRange;

  @Column(() => TimeRange)
  dailyOperation: TimeRange;

  @OneToMany(() => GradeCapacity, (capacity) => capacity.period)
  capacity?: GradeCapacity[];

  @OneToMany(() => Registration, (registration) => registration.period)
  registrations?: Registration[];

  @OneToMany(() => PeriodSchedule, (schedule) => schedule.period)
  schedule?: PeriodSchedule[];

  @OneToMany(() => OverrideSchedule, (override) => override.period)
  override?: OverrideSchedule[];
}
