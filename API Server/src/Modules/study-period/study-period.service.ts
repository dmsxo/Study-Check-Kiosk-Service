import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { StudyPeriod } from './entities/period.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { QueryPeriodDto } from './dto/query-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { GradeCapacityPair } from './dto/grade-capacity.dto';

@Injectable()
export class StudyPeriodService {
  constructor(
    @InjectRepository(StudyPeriod)
    private readonly periodRepo: Repository<StudyPeriod>,
    private dataSource: DataSource,
  ) {}

  async createPeriod(periodData: CreatePeriodDto): Promise<StudyPeriod[]> {
    const newPeriods: StudyPeriod[] = [];

    for (const grade of periodData.grades) {
      const period = this.periodRepo.create({
        termId: periodData.termId,
        studyType: periodData.studyType,
        grade: grade.grade,
        registration: periodData.registration,
        additionalRegistration: periodData.additionalRegistration,
        operation: periodData.operation,
        dailyOperation: periodData.dailyOperation,
        capacity: grade.capacity,
      });

      newPeriods.push(period);
    }

    return await this.periodRepo.save(newPeriods);
  }

  async getPeriodsByFilter(filter: QueryPeriodDto): Promise<StudyPeriod[]> {
    const { term_id, study_type, grade } = filter;
    const query = await this.periodRepo.createQueryBuilder('period');

    if (term_id !== undefined)
      query.andWhere('period.termId = :termId', { termId: term_id });

    if (study_type !== undefined)
      query.andWhere('period.studyType = :studyType', {
        studyType: study_type,
      });

    if (grade !== undefined)
      query.andWhere('period.grade = :grade', { grade: grade });
    return query.getMany();
  }

  async getPeriodById(id: number): Promise<StudyPeriod> {
    const period = await this.periodRepo.findOne({
      where: { id },
      relations: ['registrations'],
    });
    if (!period)
      throw new NotFoundException(`study period with id:${id} is not founded`);
    return period;
  }

  async updatePeriods(data: UpdatePeriodDto) {
    const { termId, studyType, grades, ...shared } = data;

    return this.dataSource.transaction(async (m) => {
      const exist = await m.find(StudyPeriod, { where: { termId, studyType } });

      const existMap = new Map<number, StudyPeriod>(
        exist.map((p) => [p.grade, p]),
      );
      const dtoMap = new Map<number, GradeCapacityPair>(
        grades.map((g) => [g.grade, g]),
      );

      const toInsert: StudyPeriod[] = [];
      const toUpdate: StudyPeriod[] = [];
      const toDelete: StudyPeriod[] = [];

      // 삭제 + 수정
      for (const [grade, period] of existMap.entries()) {
        if (!dtoMap.has(grade)) {
          toDelete.push(period);
        } else {
          const g = dtoMap.get(grade)!;

          Object.assign(period, {
            ...shared,
            capacity: g.capacity ?? undefined,
          });

          toUpdate.push(period);
        }
      }
      // 추가
      for (const [grade, g] of dtoMap.entries()) {
        if (!existMap.has(grade)) {
          const newPeriod = m.create(StudyPeriod, {
            ...shared,
            termId,
            studyType,
            grade,
            capacity: g.capacity ?? undefined,
          });

          toInsert.push(newPeriod);
        }
      }

      if (toDelete.length) await m.remove(toDelete);
      if (toUpdate.length) await m.save(toUpdate);
      if (toInsert.length) await m.save(toInsert);

      return {
        inserted: toInsert,
        updated: toUpdate,
        deleted: toDelete,
      };
    });
  }

  async deletePeriods(filter): Promise<DeleteResult> {
    const { term_id, study_type, grade } = filter;
    const query = this.periodRepo
      .createQueryBuilder()
      .delete()
      .from('study_periods'); // 여기서 테이블 지정

    if (term_id !== undefined)
      query.where('termId = :termId', { termId: term_id });

    if (study_type !== undefined)
      query.andWhere('studyType = :studyType', { studyType: study_type });

    if (grade !== undefined) query.andWhere('grade = :grade', { grade });

    return query.execute();
  }
}
