import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { UserRole } from 'src/user/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto);

    req.session.user = {
      id: user.student_id,
      role: UserRole.STUDENT,
    };

    res.send({ message: 'Login success', user: req.session.user });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: Request) {
    return req.session.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.send({ message: 'Logged out' });
    });
  }

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
