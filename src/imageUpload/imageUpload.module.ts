import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUploadService } from './imageUpload.service';
import { ImageUploadController } from './imageUpload.controller';
import { Image } from './image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), CommonModule],
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  exports: [ImageUploadService],
})
export class ImageUploadModule {}
