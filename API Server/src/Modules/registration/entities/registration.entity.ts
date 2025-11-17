import { RegistrationStatus } from 'src/common/enums/registration-status.enum';
import { StudyPeriod } from 'src/Modules/study-period/entities/period.entity';
import { User } from 'src/Modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('registrations')
@Unique(['student', 'period'])
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'date' })
  applied_at: string;

  @Column({
    type: 'enum',
    enum: Object.values(RegistrationStatus),
    default: 'active',
  })
  status: RegistrationStatus; // active, cancelled, removed

  @ManyToOne(() => User, (user) => user.registrations, {
    onDelete: 'CASCADE',
  })
  student: User;

  @ManyToOne(() => StudyPeriod, (period) => period.registrations, {
    onDelete: 'CASCADE',
  })
  period: StudyPeriod;
}
