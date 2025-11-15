import { DateRange } from 'src/common/entities/date-range.entity';
import { GradeCapacity } from 'src/common/entities/grade-capacity.entity';
import { TimeRange } from 'src/common/entities/time-range.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('study_periods')
export class StudyPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  grade: number;

  @Column()
  study_type: string;

  @Column(() => DateRange)
  registration: DateRange;

  @Column({ type: 'jsonb', nullable: true })
  additionalRegistration;

  @Column(() => DateRange)
  operation: DateRange;

  @Column(() => TimeRange)
  dailyOperation: TimeRange;

  @Column(() => GradeCapacity)
  capacity: GradeCapacity;
}
