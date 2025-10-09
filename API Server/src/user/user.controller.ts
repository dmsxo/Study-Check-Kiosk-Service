import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entitys/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create_user(@Body() userData): Promise<User> {
    return this.userService.create_user(userData);
  }

  @Get()
  get_everyone(): Promise<User[]> {
    return this.userService.get_everyone();
  }

  @Get(':id')
  get_user(@Param('id') id: number): Promise<User> {
    return this.userService.get_user(id);
  }

  @Patch(':id')
  update_user(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.update_user(id, updateData);
  }

  @Delete(':id')
  delete_user(@Param('id') id: number): Promise<User> {
    return this.userService.delete_user(id);
  }
}
