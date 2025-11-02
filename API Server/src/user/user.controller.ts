import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create_user(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.userService.create_user(createUserDto);
    return user;
  }

  @Get()
  async get_everyone(): Promise<ResponseUserDto[]> {
    const users = await this.userService.get_everyone();
    return users;
  }

  @Get(':id')
  async get_user(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUserDto> {
    return this.userService.get_user(id);
  }

  @Patch(':id')
  async update_user(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.update_user(id, updateUserDto);
  }

  @Delete(':id')
  async delete_user(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseUserDto> {
    return this.userService.delete_user(id);
  }
}
