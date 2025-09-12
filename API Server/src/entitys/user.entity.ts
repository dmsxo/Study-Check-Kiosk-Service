import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    @Index()
    student_id: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Attendance, (attendance) => attendance.student_id)
    attendances: Attendance[];
}
