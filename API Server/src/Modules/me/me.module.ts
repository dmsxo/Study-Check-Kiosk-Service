import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [AttendanceModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
