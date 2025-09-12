import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'eunteapg',
    database: 'Study_Check_Data',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    dropSchema: true,
};
