import { Column } from 'typeorm';

export class GradeCapacity {
  @Column({ type: 'int', nullable: true })
  grade1?: number;

  @Column({ type: 'int', nullable: true })
  grade2?: number;

  @Column({ type: 'int', nullable: true })
  grade3?: number;
}
