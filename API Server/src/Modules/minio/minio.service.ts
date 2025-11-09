// src/minio/minio.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

@Injectable()
export class MinioService {
  private s3: S3Client;

  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000', // MinIO 주소
      credentials: {
        accessKeyId: 'admin',
        secretAccessKey: 'password123',
      },
      forcePathStyle: true, // 필수
    });
  }

  async uploadImage(filePath: string): Promise<Image> {
    const fileName = filePath.split('/').pop();

    await this.s3.send(
      new PutObjectCommand({
        Bucket: 'images', // 버킷 이름
        Key: fileName,
        Body: fs.readFileSync(filePath),
      }),
    );

    const url = `http://localhost:9000/images/${fileName}`;
    const img = this.imageRepo.create({ filename: fileName, url });
    return this.imageRepo.save(img);
  }
}
