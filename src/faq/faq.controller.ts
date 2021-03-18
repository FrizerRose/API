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
  findAll(): Promise<Faq[] | undefined> {
    return this.faqService.getAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: FaqCreateDto): Promise<any> {
    return this.faqService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: FaqUpdateDto): Promise<Faq> {
    return this.faqService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.faqService.delete(id);
  }
}
