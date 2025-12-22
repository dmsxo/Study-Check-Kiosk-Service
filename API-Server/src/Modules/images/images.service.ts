// src/images/images.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface CachedUrl {
  url: string;
  expiresAt: number; // timestamp(ms)
}

@Injectable()
export class ImagesService {
  private s3 = new S3Client({
    region: 'ap-northeast-2',
    endpoint: 'http://daein.mcv.kr:9000',
    credentials: {
      accessKeyId: process.env.MINIO_ID!,
      secretAccessKey: process.env.MINIO_KEY!,
    },
    forcePathStyle: true,
  });

  private bucketName = 'images';

  private presignedUrlCache = new Map<string, CachedUrl>(); // filename, url

  // 이미지 업로드 (새로 업로드/교체)
  async uploadImage(file: Express.Multer.File, existingFilename?: string) {
    if (!file) throw new BadRequestException('파일이 필요합니다.');

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    if (!allowedExt.includes(ext))
      throw new BadRequestException('jpg/jpeg/png만 허용');

    const filename = `${uuidv4()}${ext}`;

    // MinIO 업로드
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // 기존 이미지 삭제(있으면)
    if (existingFilename) {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: existingFilename,
        }),
      );

      // 기존 캐시 제거
      this.presignedUrlCache.delete(existingFilename);
    }

    return filename; // DB에 저장할 파일명만 반환
  }

  // 이미지 삭제
  async deleteImage(filename: string) {
    if (!filename) throw new BadRequestException('삭제할 파일명이 필요합니다.');
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      }),
    );
    this.presignedUrlCache.delete(filename);
    return { message: '삭제 완료' };
  }

  // Presigned URL 생성
  async getPresignedUrl(filename: string, expiresIn = 60 * 60 * 24) {
    if (!filename) throw new BadRequestException('파일 이름 필요');

    const now = Date.now();
    const cached = this.presignedUrlCache.get(filename);

    // 캐시 유효하면 그대로 반환
    if (cached && cached.expiresAt > now) return cached.url;

    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: filename,
        }),
      );
    } catch (err) {
      // 존재하지 않으면 예외
      throw new NotFoundException('파일이 존재하지 않습니다.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn });

    this.presignedUrlCache.set(filename, {
      url,
      expiresAt: now + expiresIn * 1000,
    });
    return url;
  }
}
