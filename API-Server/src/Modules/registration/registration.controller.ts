import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { QueryRegistrationDto } from './dto/query-registration.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async createRegisration(@Body() registrationDto: CreateRegistrationDto) {
    return await this.registrationService.createRegisration(registrationDto);
  }

  @Get(':id')
  async getRegistration(@Param('id') id: number) {
    return await this.registrationService.getRegistration(id);
  }

  @Get()
  async getRegistrationByFilter(@Query() queryDto: QueryRegistrationDto) {
    return await this.registrationService.getRegistrationByFilter(queryDto);
  }

  @Patch(':id')
  async updateRegistration(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateRegistrationDto,
  ) {
    return await this.registrationService.updateRegistration(
      id,
      updateStatusDto,
    );
  }

  @Delete(':id')
  async deleteRegistration(@Param('id') id: number) {
    return await this.registrationService.deleteRegistration(id);
  }
}
