import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

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

<<<<<<< HEAD:API Server/src/study/attendance.entity.ts
    @ManyToOne(() => User, (student) => student.attendances)
=======
    @ManyToOne(() => User, (student_id) => student_id.attendances)
>>>>>>> ba6db3b78fecbb7cf5ec234dba4ee8100b98d84a:API Server/src/entitys/attendance.entity.ts
    student_id: User;
}
