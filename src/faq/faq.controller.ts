import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Res,
  Put,
  Query,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { FaqCreateDto, FaqUpdateDto } from './dto/index';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';
import { Response } from 'express';

@Controller('faq')
@UseInterceptors(CacheInterceptor)
@ApiTags('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const faq = this.faqService.getAll();
    response.send(faq);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: FaqCreateDto, @Res() response: Response): Promise<any> {
    const faq = this.faqService.create(payload);
    response.send(faq);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: FaqUpdateDto, @Res() response: Response): Promise<any> {
    const faq = this.faqService.update(payload);
    response.send(faq);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const faq = this.faqService.delete(id);
    response.send(faq);
  }
}
