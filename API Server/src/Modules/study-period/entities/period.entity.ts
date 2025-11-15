import { IsEnum } from 'class-validator';
import { DateRange } from 'src/common/entities/date-range.entity';
import { GradeCapacity } from 'src/common/entities/grade-capacity.entity';
import { TimeRange } from 'src/common/entities/time-range.entity';
import { StudyType } from 'src/common/enums/study-type.enum';
import { Registration } from 'src/Modules/registration/entities/registration.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('study_periods')
@Unique(['termId', 'grade', 'studyType'])
export class StudyPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  termId; // 학기

  @Column({ type: 'int' })
  grade: number; // 학년

  @Column({ type: 'enum', enum: StudyType })
  studyType: StudyType; //야간, 자율

  @Column(() => DateRange)
  registration: DateRange;

  @Column({ type: 'jsonb', nullable: true })
  additionalRegistration;

  @Column(() => DateRange)
  operation: DateRange;

  @Column(() => TimeRange)
  dailyOperation: TimeRange;

  @Column(() => GradeCapacity)
  capacity?: GradeCapacity;

  @OneToMany(() => Registration, (registration) => registration.period)
  registrations?: Registration;
}
