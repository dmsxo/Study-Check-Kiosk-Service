import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StudyPeriod } from 'src/Modules/study-period/entities/period.entity';

@Entity('attendances')
@Unique(['student', 'date', 'period'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'time' })
  check_in_time: string; // HH:MM:SS

  @Column({ type: 'time', nullable: true })
  check_out_time?: string; // HH:MM:SS

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (studentId) => studentId.attendances, {
    onDelete: 'CASCADE',
  })
  student: User;

  @ManyToOne(() => StudyPeriod, (period) => period.attendances, {
    onDelete: 'CASCADE',
  })
  period: StudyPeriod;
}
