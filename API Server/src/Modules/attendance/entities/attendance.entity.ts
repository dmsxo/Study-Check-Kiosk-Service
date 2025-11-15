import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StudyType } from 'src/common/enums/study-type.enum';

@Entity('attendances')
@Unique(['student_id', 'date', 'type'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Object.values(StudyType) })
  type: StudyType; // morning, evning

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'time' })
  check_in_time: string; // HH:MM:SS

  @Column({ type: 'time', nullable: true })
  check_out_time: string; // HH:MM:SS

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (student_id) => student_id.attendances)
  student_id: User;
}
