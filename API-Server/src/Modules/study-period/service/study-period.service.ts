import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { StudyPeriod } from '../entities/period.entity';
import { CreatePeriodDto } from '../dto/create-period.dto';
import { QueryPeriodDto } from '../dto/query-period.dto';
import { UpdatePeriodDto } from '../dto/update-period.dto';
import { GradeCapacityPair } from '../dto/grade-capacity.dto';
import { GradeCapacity } from '../entities/grade-capacity.entity';
import { PeriodSchedule } from '../entities/period-schedule.entity';

@Injectable()
export class StudyPeriodService {
  constructor(
    @InjectRepository(StudyPeriod)
    private readonly periodRepo: Repository<StudyPeriod>,
    private dataSource: DataSource,
  ) {}

  async createPeriod(periodData: CreatePeriodDto): Promise<StudyPeriod> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const period = this.periodRepo.create({
        name: periodData.name,
        registration: periodData.registration,
        additionalRegistration: periodData.additionalRegistration,
        operation: periodData.operation,
        dailyOperation: periodData.dailyOperation,
      });
      await queryRunner.manager.save(period);

      // Handle GradeCapacity
      const capacities = periodData.capacities.map((g) =>
        queryRunner.manager.create(GradeCapacity, {
          grade: g.grade,
          capacity: g.capacity,
          periodId: period.id,
        }),
      );

      await queryRunner.manager.save(capacities);

      const schedules = periodData.schedules.map((s) =>
        queryRunner.manager.create(PeriodSchedule, {
          grade: s.grade,
          weekday: s.weekday,
          isOpen: s.isOpen,
          periodId: period.id,
        }),
      );

      await queryRunner.manager.save(schedules);

      await queryRunner.commitTransaction();
      return period;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create study period');
    } finally {
      await queryRunner.release();
    }
  }

  async getPeriodsByFilter(
    filter: Partial<QueryPeriodDto>,
  ): Promise<StudyPeriod[]> {
    const { grade, active_from, active_to, relation } = filter;
    const query = await this.periodRepo.createQueryBuilder('period');

    if (!!relation)
      query
        .leftJoinAndSelect('period.registrations', 'registrations')
        .leftJoinAndSelect('registrations.student', 'student')
        .leftJoinAndSelect('period.capacity', 'capacity')
        .leftJoinAndSelect('period.schedule', 'schedule');

    if (active_from !== undefined)
      query.andWhere('NOT(period.operation.start > :activeTo)', {
        activeTo: active_to,
      });

    if (active_to !== undefined)
      query.andWhere('NOT(period.operation.end < :activeFrom)', {
        activeFrom: active_from,
      });

    if (grade !== undefined)
      query.andWhere('period.grade = :grade', { grade: grade });
    return query.getMany();
  }

  async getPeriodById(id: number): Promise<StudyPeriod> {
    const period = await this.periodRepo.findOne({
      where: { id },
    });
    if (!period)
      throw new NotFoundException(`study period with id:${id} is not founded`);
    return period;
  }

  async updatePeriods(id: number, data: UpdatePeriodDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const period = await this.periodRepo.findOne({ where: { id } });
      if (!period) throw new NotFoundException('Study period not found');

      queryRunner.manager.merge(StudyPeriod, period, {
        name: data.name,
        registration: data.registration,
        additionalRegistration: data.additionalRegistration,
        operation: data.operation,
        dailyOperation: data.dailyOperation,
      });
      await queryRunner.manager.save(period);

      if (data.capacities) {
        await queryRunner.manager.delete(GradeCapacity, { periodId: id });
        const capacityEntities = data.capacities.map((c) =>
          queryRunner.manager.create(GradeCapacity, { ...c, periodId: id }),
        );
        await queryRunner.manager.save(GradeCapacity, capacityEntities);
      }

      if (data.schedules && data.schedules?.length > 0) {
        const existingSchedules = await queryRunner.manager.findBy(
          PeriodSchedule,
          {
            periodId: id,
          },
        );

        for (const s of data.schedules) {
          // [비교] 같은 학년, 같은 요일인 기존 데이터가 있는지 확인
          const existing = existingSchedules.find(
            (ex) => ex.grade === s.grade && ex.weekday === s.weekday,
          );

          if (existing) {
            // [수정] 이미 존재한다면 ID를 유지한 채 시간과 isOpen만 업데이트
            await queryRunner.manager.update(PeriodSchedule, existing.id, {
              isOpen: true, // 목록에 있으니 활성화
            });
          } else {
            // [추가] 이번에 새로 들어온 요일/학년이라면 신규 생성
            await queryRunner.manager.save(
              queryRunner.manager.create(PeriodSchedule, {
                ...s,
                periodId: id,
                isOpen: true,
              }),
            );
          }
        }

        // [비활성화] DTO에는 없는데 DB에는 'isOpen: true'로 되어 있는 것들을 찾아 끕니다.
        const incomingKeys = data.schedules.map(
          (s) => `${s.grade}-${s.weekday}`,
        );
        const toDisable = existingSchedules.filter(
          (ex) =>
            ex.isOpen && !incomingKeys.includes(`${ex.grade}-${ex.weekday}`),
        );

        if (toDisable.length > 0) {
          await queryRunner.manager.update(
            PeriodSchedule,
            toDisable.map((d) => d.id),
            { isOpen: false },
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to update study period');
    } finally {
      await queryRunner.release();
    }
  }

  async deletePeriods(periodId: number): Promise<DeleteResult> {
    return await this.periodRepo.delete(periodId);
  }
}
