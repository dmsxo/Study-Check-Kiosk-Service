import { Global, Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { ImagesModule } from '../images/images.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), ImagesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
