import { StudyType } from 'src/common/enums/study-type.enum';
import { Weekday } from 'src/common/enums/weekday.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('override_schedules')
export class OverrideSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  grade: number; // 1, 2, 3

  @Column({ type: 'enum', enum: StudyType })
  studyType: StudyType;

  @Column({ type: 'date' })
  date: string;

  @Column()
  description: string;

  @Column()
  isOpen: boolean;
}
