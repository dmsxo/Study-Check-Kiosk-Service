import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/Modules/auth/auth.guard';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create_user(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.userService.create_user(createUserDto);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async get_everyone(): Promise<ResponseUserDto[]> {
    const users = await this.userService.get_everyone();
    return plainToInstance(ResponseUserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async get_user(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUserDto> {
    const user = await this.userService.get_user(id);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update_user(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const updatedUser = await this.userService.update_user(id, updateUserDto);
    return plainToInstance(ResponseUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async delete_user(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUserDto> {
    const deletedUser = await this.userService.delete_user(id);
    return plainToInstance(ResponseUserDto, deletedUser, {
      excludeExtraneousValues: true,
    });
  }
}
