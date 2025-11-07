import { Module } from '@nestjs/common';
import { KioskService } from './kiosk.service';
import { KioskController } from './kiosk.controller';

@Module({
  controllers: [KioskController],
  providers: [KioskService],
})
export class KioskModule {}
