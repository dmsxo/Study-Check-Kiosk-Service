import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entitys/attendance.entity';
import { User } from '../entitys/user.entity';
import { StudyController } from './study.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Attendance, User])],
    controllers: [StudyController],
    providers: [StudyService],
})
export class StudyModule {}
