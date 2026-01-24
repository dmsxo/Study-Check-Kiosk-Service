import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PeriodSchedule } from 'src/Modules/schedule/entities/period-schedule.entity';

@Entity('attendances')
@Unique(['studentId', 'date', 'type'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'time' })
  check_in_time: string; // HH:MM:SS

  @Column({ type: 'time', nullable: true })
  check_out_time: string; // HH:MM:SS

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (studentId) => studentId.attendances, {
    onDelete: 'CASCADE',
  })
  studentId: User;

  @ManyToOne(() => PeriodSchedule, (schedule) => schedule.attendances, {
    onDelete: 'CASCADE',
  })
  schedule: PeriodSchedule;
}
