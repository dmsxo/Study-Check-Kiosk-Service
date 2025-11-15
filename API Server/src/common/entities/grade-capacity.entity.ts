import { Column } from 'typeorm';

export class GradeCapacity {
  @Column({ type: 'int' })
  grade1: number;

  @Column({ type: 'int' })
  grade2: number;

  @Column({ type: 'int' })
  grade3: number;
}
