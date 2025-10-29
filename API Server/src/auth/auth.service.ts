import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  login() {}

  logout() {}

  async generate_code(issuer: string, ttl: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789';
    let code: string = '';
    for (let i = 0; i < 6; i++) {
      code += chars[randomInt(0, chars.length)];
    }

    await this.cacheManager.set(`auth:${code}`, issuer, ttl);
    return code;
  }

  async verify_code(code: string) {
    return (await this.cacheManager.get(`auth:${code}`)) ?? 'NotFound:404';
  }
}
