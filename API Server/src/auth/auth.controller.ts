import { Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {}

  @Post('logout')
  logout() {}

  @Post('checkin/code')
  generate_code() {
    return this.authService.generate_code();
  }

  @Get('checkin/verify')
  verify_code() {
    return this.authService.verify_code();
  }
}
