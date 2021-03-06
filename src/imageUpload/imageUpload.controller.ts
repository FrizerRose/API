import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageUploadService } from '../imageUpload/imageUpload.service';
import { Request, Response } from 'express';

@Controller('image')
@ApiTags('image')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Service Unavailable' })
  async addImages(@Req() request: Request, @Res() response: Response): Promise<any> {
    try {
      const images = await this.imageUploadService.fileUpload(request, response);
      return response.status(201).json(images);
    } catch (error) {
      return response.status(500).json(`Failed to upload files. ${error.message}`);
    }
  }
}
