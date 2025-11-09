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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('image'))
  async update_user(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    const updatedUser = await this.userService.update_user(
      id,
      updateUserDto,
      file,
    );
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
