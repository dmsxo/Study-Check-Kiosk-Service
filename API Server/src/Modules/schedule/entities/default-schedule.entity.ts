import { WeekDay } from 'aws-sdk/clients/ec2';
import { StudyType } from 'src/common/enums/study-type.enum';
import { Weekday } from 'src/common/enums/weekday.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

// limit = 7*3*2 = 42 Rows
@Entity('default_schedules')
@Unique(['grade', 'studyType', 'weekday'])
export class DefaultSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  grade: number; // 1, 2, 3

  @Column({ type: 'enum', enum: StudyType })
  studyType: StudyType;

  @Column({ type: 'enum', enum: Weekday })
  weekday: Weekday;

  @Column()
  isOpen: boolean;
}
