import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {}

  @Post('logout')
  logout() {}

  @Post('checkin/code')
  generate_code(
    @Body('issuer') issuer: string,
    @Body('ttl') ttl: number = 60000,
  ): Promise<string> {
    if (issuer === undefined)
      throw new BadRequestException('The issuer field does not exist');
    return this.authService.generate_code(issuer, ttl);
  }

  @Post('checkin/verify')
  verify_code(@Body('code') code: string): Promise<string> {
    if (code === undefined)
      throw new BadRequestException('The code field does not exist');
    return this.authService.verify_code(code);
  }
}
