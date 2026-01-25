import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { StudyPeriod } from './entities/period.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { QueryPeriodDto } from './dto/query-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { GradeCapacityPair } from './dto/grade-capacity.dto';
import { GradeCapacity } from './entities/grade-capacity.entity';
import { PeriodSchedule } from '../schedule/entities/period-schedule.entity';

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
      await this.periodRepo.save(period);

      // Handle GradeCapacity
      const capacities = periodData.capacities.map((g) => {
        queryRunner.manager.create(GradeCapacity, {
          grade: g.grade,
          capacity: g.capacity,
          periodId: period.id,
        });
      });

      await queryRunner.manager.save(capacities);

      const schedules = periodData.schedules.map((s) => {
        queryRunner.manager.create(PeriodSchedule, {
          grade: s.grade,
          weekday: s.weekday,
          isOpen: s.isOpen,
          periodId: period.id,
        });
      });

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
        .leftJoinAndSelect('registrations.student', 'student');

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
      }

      if (data.schedules) {
        await queryRunner.manager.update(
          PeriodSchedule,
          { periodId: id, isOpen: true },
          { isOpen: false },
        );

        // [B] 새로운 스케줄 규칙들을 모두 새로 생성합니다.
        const newSchedules: PeriodSchedule[] = [];
        for (const s of data.schedules) {
          newSchedules.push(
            queryRunner.manager.create(PeriodSchedule, {
              grade: s.grade,
              weekday: s.weekday,
              isOpen: s.isOpen,
              periodId: id,
            }),
          );
        }
        await queryRunner.manager.save(PeriodSchedule, newSchedules);
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
