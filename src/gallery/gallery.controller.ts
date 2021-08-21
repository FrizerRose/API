import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Res,
  Post,
  Put,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GalleryCreateDto, GalleryUpdateDto } from './dto/index';
import { Gallery } from './gallery.entity';
import { GallerysService } from './gallery.service';
import { Response } from 'express';

@Controller('gallery')
@UseInterceptors(CacheInterceptor)
@ApiTags('gallery')
export class GallerysController {
  constructor(private readonly galleryService: GallerysService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const gallery = await this.galleryService.getAll();
    response.send(gallery);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: GalleryCreateDto, @Res() response: Response): Promise<any> {
    const gallery = await this.galleryService.create(payload);
    response.send(gallery);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: GalleryUpdateDto, @Res() response: Response): Promise<any> {
    const gallery = await this.galleryService.update(payload);
    response.send(gallery);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const gallery = await this.galleryService.delete(id);
    response.send(gallery);
  }
}
