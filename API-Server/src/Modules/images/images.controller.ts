// src/images/images.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // 이미지 업로드 (optional: 기존 파일명 제공 시 교체)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('existingFilename') existingFilename?: string,
  ) {
    const filename = await this.imagesService.uploadImage(
      file,
      existingFilename,
    );
    return { filename };
  }

  // 이미지 삭제
  @Delete(':filename')
  async deleteImage(@Param('filename') filename: string) {
    return this.imagesService.deleteImage(filename);
  }

  // Presigned URL
  @Get('presigned/:filename')
  async getPresignedUrl(@Param('filename') filename: string) {
    const url = await this.imagesService.getPresignedUrl(filename);
    return { url };
  }
}
