import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DefaultSchedule } from './entities/default-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OverrideSchedule } from './entities/override-schedule.entity';
import { CreateDefaultScheduleDto } from './dto/default/create-default-schedule.dto';
import { Weekday } from 'src/common/enums/weekday.enum';
import { StudyType } from 'src/common/enums/study-type.enum';
import { UpdateDefaultScheduleDto } from './dto/default/update-default-schedule.dto';
import { CreateOverrideScheduleDto } from './dto/override/create-override-schedule.dto';
import { DeleteResult } from 'typeorm/browser';
import { UpdateOverrideScheduleDto } from './dto/override/update-override-schedule.dto';
import { TypeSchedule } from './dto/type-schedule.dto';
import { QueryOverrideScheduleDto } from './dto/override/query-override-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(DefaultSchedule)
    private readonly defaultScheduleRepo: Repository<DefaultSchedule>,

    @InjectRepository(OverrideSchedule)
    private readonly overrideScheduleRepo: Repository<OverrideSchedule>,
  ) {}

  // default schedule
  async createDefaultSchedule(
    weekSchedule: CreateDefaultScheduleDto,
  ): Promise<DefaultSchedule[]> {
    const newSchedules: DefaultSchedule[] = [];

    return await this.defaultScheduleRepo.manager.transaction(
      async (manager) => {
        for (const day of Object.values(Weekday)) {
          for (const type of Object.values(StudyType)) {
            for (const grade of [1, 2, 3]) {
              const isOpen = weekSchedule[day][type][`grade${grade}`];
              newSchedules.push(
                this.defaultScheduleRepo.create({
                  weekday: day,
                  studyType: type,
                  grade: grade,
                  isOpen: isOpen,
                }),
              );
            }
          }
        }
        return await manager.save(newSchedules);
      },
    );
  }

  async getDefaultSchedule(): Promise<DefaultSchedule[]> {
    return await this.defaultScheduleRepo.find();
  }

  async updateDefaultSchedule(
    weekSchedule: UpdateDefaultScheduleDto,
  ): Promise<DefaultSchedule[]> {
    return await this.defaultScheduleRepo.manager.transaction(
      async (manager) => {
        const updated: DefaultSchedule[] = [];

        for (const weekday of Object.values(Weekday)) {
          const dayDto = weekSchedule[weekday];
          if (!dayDto) continue;

          for (const studyType of Object.values(StudyType)) {
            const typeDto = dayDto[studyType];
            if (!typeDto) continue;

            for (const grade of [1, 2, 3]) {
              const isOperating = typeDto[`grade${grade}`];

              let existing = await manager.findOne(DefaultSchedule, {
                where: { weekday, studyType, grade },
              });

              if (existing) {
                existing.isOpen = isOperating;
              } else {
                existing = manager.create(DefaultSchedule, {
                  weekday,
                  studyType,
                  grade,
                  isOpen: isOperating,
                });
              }

              updated.push(await manager.save(existing));
            }
          }
        }
        return updated;
      },
    );
  }

  async deleteDefaultSchedule(id: number): Promise<DeleteResult> {
    const result = await this.defaultScheduleRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return result;
  }

  // override schedule
  async createOverrideSchedule(
    overrideDto: CreateOverrideScheduleDto,
  ): Promise<OverrideSchedule[]> {
    const newSchedules: OverrideSchedule[] = [];

    return await this.overrideScheduleRepo.manager.transaction(
      async (manager) => {
        for (const studyType of Object.values(StudyType)) {
          for (const grade of [1, 2, 3]) {
            const isOpen = overrideDto.targets[studyType][`grade${grade}`];

            newSchedules.push(
              manager.create(OverrideSchedule, {
                grade,
                studyType,
                date: overrideDto.date,
                descriptions: overrideDto.descriptions,
                isOpen,
              }),
            );
          }
        }

        return await manager.save(newSchedules);
      },
    );
  }

  async getOverrideSchedule(filter: QueryOverrideScheduleDto) {
    const { grade, study_type, date_from, date_to }: QueryOverrideScheduleDto =
      filter;
    const query = this.overrideScheduleRepo.createQueryBuilder('override');

    // console.log(grade, study_type, date_from, date_to, "test");

    if (filter.date_from !== undefined) {
      query.andWhere('override.date >= :dateFrom', { dateFrom: date_from });
    }

    if (filter.date_to !== undefined) {
      query.andWhere('override.date <= :dateTo', { dateTo: date_to });
    }

    if (filter.grade !== undefined) {
      query.andWhere('override.grade = :grade', { grade });
    }

    if (filter.study_type !== undefined) {
      query.andWhere('override.studyType = :study_type', { study_type });
    }

    query.orderBy('override.date', 'ASC');
    return await query.getMany();
  }

  async updateOverrideSchedule(updatedOverrideDto: UpdateOverrideScheduleDto) {
    const { date, descriptions, targets }: UpdateOverrideScheduleDto =
      updatedOverrideDto;

    // 날짜에 맞는 모든 엔티티 불러오기
    const schedules = await this.overrideScheduleRepo.find({ where: { date } });

    const updatedSchedules: OverrideSchedule[] = [];

    for (const schedule of schedules) {
      // descriptions 완전 교체
      schedule.descriptions = descriptions;

      // isOpen 업데이트
      schedule.isOpen = targets[schedule.studyType][`grade${schedule.grade}`];

      // descriptions가 비어있으면 삭제
      if (schedule.descriptions.length === 0) {
        await this.overrideScheduleRepo.remove(schedule);
      } else {
        updatedSchedules.push(schedule);
      }
    }

    // DB에 한 번에 저장
    return await this.overrideScheduleRepo.save(updatedSchedules);
  }

  async deleteOverrideSchedule(date: string): Promise<DeleteResult> {
    return await this.overrideScheduleRepo.delete({ date });
  }
}
