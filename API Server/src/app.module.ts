import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StudyModule } from './study/study.module';
import { AnalysisModule } from './analysis/analysis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';

@Module({
    imports: [
        UserModule,
        AuthModule,
        StudyModule,
        AnalysisModule,

        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [Attendance, User],
            synchronize: true,
            logging: ['query', 'error', 'warn'],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
