import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
} from 'typeorm';

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
}
