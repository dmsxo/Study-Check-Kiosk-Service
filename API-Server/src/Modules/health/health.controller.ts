// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async checkHealth() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok' };
    } catch {
      return { status: 'db_failed' };
    }
  }
}
