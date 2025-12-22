import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { Image } from './image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
