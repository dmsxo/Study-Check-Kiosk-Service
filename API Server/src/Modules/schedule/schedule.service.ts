import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DefaultSchedule } from './entities/default-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OverrideSchedule } from './entities/override-schedule.entity';
import { CreateDefaultScheduleDto } from './dto/default/create-default-schedule.dto';
import { Weekday } from 'src/common/enums/weekday.enum';
import { StudyType } from 'src/common/enums/study-type.enum';
import { UpdateDefaultScheduleDto } from './dto/default/update-default-schedule.dto';

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

    for (const day of Object.values(Weekday)) {
      for (const type of Object.values(StudyType)) {
        for (const grade of [1, 2, 3]) {
          const isOpen = weekSchedule[day][type][`grade${grade}`];
          console.log(
            day,
            type,
            grade,
            weekSchedule[day][type][`grade${grade}`],
          );
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

    return await this.defaultScheduleRepo.save(newSchedules);
  }

  async getDefaultSchedule(): Promise<DefaultSchedule[]> {
    return await this.defaultScheduleRepo.find();
  }

  async updateDefaultSchedule(weekSchedule: UpdateDefaultScheduleDto) {
    await this.defaultScheduleRepo.manager.transaction(async (manager) => {
      for (const weekday of Object.values(Weekday)) {
        const dayDto = weekSchedule[weekday];
        for (const studyType of Object.values(StudyType)) {
          if (!dayDto) continue; // undefined이면 건너뜀
          const typeDto = dayDto[studyType];
          for (const grade of [1, 2, 3]) {
            const isOperating = typeDto[`grade${grade}`];

            const existing = await manager.findOne(DefaultSchedule, {
              where: { weekday, studyType, grade },
            });

            if (existing) {
              existing.isOpen = isOperating;
              await manager.save(existing);
            } else {
              const newSchedule = manager.create(DefaultSchedule, {
                weekday,
                studyType,
                grade,
                isOperating,
              });
              await manager.save(newSchedule);
            }
          }
        }
      }
    });
  }

  async deleteDefaultSchedule(id: number) {
    const result = await this.defaultScheduleRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return result;
  }

  // override schedule
  async createOverrideSchedule() {}

  async getOverrideSchedule() {}

  async updateOverrideSchedule() {}

  async deleteOverrideSchedule() {}
}
