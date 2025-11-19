import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Registration } from 'src/Modules/registration/entities/registration.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true, type: 'int' })
  studentId: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  profileImageFilename?: string;

  @OneToMany(() => Attendance, (attendance) => attendance.student_id)
  attendances?: Attendance[];

  @OneToMany(() => Registration, (registration) => registration.student)
  registrations?: Registration;
}
