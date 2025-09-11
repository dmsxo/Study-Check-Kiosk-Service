import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string; // YYYY-MM-DD

    @Column()
    check_in: string; // HH:MM:SS

    @Column({ nullable: true })
    check_out: string; // HH:MM:SS

    @Column({ nullable: true })
    description: string;

    @Column()
    @ManyToOne(() => User, (student) => student.attendances)
    student_id: User;
}
