import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { randomInt } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async validateUser(loginDto: LoginDto) {
    // const { email } = loginDto;

    // const user = await this.userRepo.findOne({ where: { email } });

    const { studentId } = loginDto;

    const user = await this.userRepo.findOne({ where: { studentId } });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async generate_code(issuer: string, ttl: number): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789';
    let code: string = '';
    for (let i = 0; i < 6; i++) {
      code += chars[randomInt(0, chars.length)];
    }

    await this.cacheManager.set(`auth:${code}`, issuer, ttl);
    return code;
  }

  async verify_code(code: string): Promise<string> {
    const issuer = await this.cacheManager.get<string>(`auth:${code}`);
    if (!issuer) throw new NotFoundException('Invalid code.');
    return issuer;
  }
}
