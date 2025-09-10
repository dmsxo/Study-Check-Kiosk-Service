import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StudyModule } from './study/study.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
    imports: [UserModule, AuthModule, StudyModule, AnalysisModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
