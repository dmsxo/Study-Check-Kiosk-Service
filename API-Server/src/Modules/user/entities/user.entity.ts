import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Registration } from 'src/Modules/registration/entities/registration.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Object.values(UserRole),
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Index()
  @Column({ unique: true, type: 'int', nullable: true })
  studentId?: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  profileImageFilename?: string;

  @OneToMany(() => Attendance, (attendance) => attendance.studentId)
  attendances?: Attendance[];

  @OneToMany(() => Registration, (registration) => registration.student)
  registrations?: Registration[];
}
