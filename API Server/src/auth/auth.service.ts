import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  login() {}

  logout() {}

  async generate_code() {
    return await this.cacheManager.set('testKey', 'testValue', 60000);
  }

  async verify_code() {
    return await this.cacheManager.get('testKey');
  }
}
