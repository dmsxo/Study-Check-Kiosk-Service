import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OverrideSchedule } from '../entities/override-schedule.entity';
import { CreateOverrideBatchDto } from '../dto/override/create-override-schedule.dto';
import { DeleteResult } from 'typeorm/browser';
import { QueryOverrideScheduleDto } from '../dto/override/query-override-schedule.dto';
import { PeriodOverrideMap } from '../entities/period-override-map.entity';

@Injectable()
export class OverrideService {
  constructor(
    @InjectRepository(OverrideSchedule)
    private readonly overrideScheduleRepo: Repository<OverrideSchedule>,
    private dataSource: DataSource,
  ) {}
  // override schedule
  async getDailyDetail(date: string) {
    return await this.overrideScheduleRepo.find({
      where: { date },
      relations: ['mappings', 'mappings.period'],
    });
  }
  async upsertOverrideBatch(dto: CreateOverrideBatchDto) {
    return await this.dataSource.transaction(async (manager) => {
      let event = await manager.findOneBy(OverrideSchedule, {
        date: dto.date,
      });
      if (!event) {
        event = manager.create(OverrideSchedule, {
          date: dto.date,
          descriptions: dto.descriptions,
        });
        event = await manager.save(event);
      }

      const targets = dto.targets ?? [];

      if (targets.length > 0) {
        const periodIds = targets.map((t) => t.periodId);

        await manager.delete(PeriodOverrideMap, {
          eventId: event.id,
          periodId: In(periodIds),
        });

        const newMaps = dto.targets.map((target) =>
          manager.create(PeriodOverrideMap, {
            eventId: event.id,
            periodId: target.periodId,
            grade: target.grade,
            isOpen: target.isOpen,
          }),
        );

        await manager.save(PeriodOverrideMap, newMaps);
      }

      return event;
    });
  }

  async deleteEvent(eventId: number) {
    return await this.overrideScheduleRepo.delete(eventId);
  }
}
