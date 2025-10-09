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

    TypeOrmModule.forRoot(typeORMConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
