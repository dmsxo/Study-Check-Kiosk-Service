import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('attendances')
@Unique(['student_id', 'date', 'type'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // morning, evning

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'time' })
  check_in_time: Date; // HH:MM:SS

  @Column({ type: 'time', nullable: true })
  check_out_time: Date; // HH:MM:SS

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (student_id) => student_id.attendances)
  student_id: User;
}
