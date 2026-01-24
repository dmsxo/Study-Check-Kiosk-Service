import { WeekDay } from 'aws-sdk/clients/ec2';
import { Weekday } from 'src/common/enums/weekday.enum';
import { Attendance } from 'src/Modules/attendance/entities/attendance.entity';
import { StudyPeriod } from 'src/Modules/study-period/entities/period.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// limit = 7*3*2 = 42 Rows
@Entity('period_schedules')
@Unique(['grade', 'studyType', 'weekday'])
export class PeriodSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  grade: number; // 1, 2, 3

  @Column({ type: 'enum', enum: Weekday })
  weekday: Weekday;

  @Column()
  isOpen: boolean;

  @ManyToOne(() => StudyPeriod, (period) => period.schedule, {
    onDelete: 'CASCADE',
  })
  period: StudyPeriod;

  @OneToMany(() => Attendance, (attendance) => attendance.schedule)
  attendances: Attendance[];
}
