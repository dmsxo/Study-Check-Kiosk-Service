import { Controller, Get, Post, Query } from '@nestjs/common';
import { KioskService } from './kiosk.service';

@Controller('kiosk')
export class KioskController {
  constructor(private readonly kioskService: KioskService) {}

  // 학생이 키오스크 키 발급 인증시 키오스크에 날려줄 인증 완료용 엔드포인트
  @Post('pong')
  async ping(
    @Query('kioskId') kioskId: string,
    @Query('studentId') studentId: number,
  ) {
    return this.kioskService.reportCheckin(kioskId, studentId);
  }

  // 키오스크에서 풀링용 엔드포인트
  @Get('ping')
  async pong(@Query('kioskId') kioskId: string) {
    return await this.kioskService.checkinStatus(kioskId);
  }
}
