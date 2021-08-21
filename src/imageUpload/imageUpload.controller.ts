import { Body, Controller, Post, Req, Res, Delete, Param } from '@nestjs/common';
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

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const image = await this.imageUploadService.delete(id);
    response.send(image);
  }
}
