import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class KioskService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async reportCheckin(kioskId: string, studentId: number): Promise<number> {
    // 키오스크에서 학생 체크인 보고시 캐시에 해당 학생의 체크인 상태를 저장
    return await this.cacheManager.set(`pong:${kioskId}`, studentId, 5000);
  }

  async checkinStatus(kioskId: string): Promise<number | null> {
    // 학생의 체크인 상태를 캐시에서 조회
    const res = this.cacheManager.get<number | null>(`pong:${kioskId}`);
    if (!res) this.cacheManager.del(`pong:${kioskId}`);
    return res;
  }
}
