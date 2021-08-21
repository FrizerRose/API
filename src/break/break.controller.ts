import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Res,
  Put,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BreakCreateDto, BreakUpdateDto } from './dto/index';
import { BreaksService } from './break.service';
import { Break } from './break.entity';
import { response, Response } from 'express';

@Controller('break')
@UseInterceptors(CacheInterceptor)
@ApiTags('break')
export class BreaksController {
  constructor(private readonly breakService: BreaksService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const breaks = await this.breakService.getAll();
    response.send(breaks);
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const foundBreak = await this.breakService.get(id);
    if (foundBreak) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(foundBreak);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: BreakCreateDto, @Res() response: Response): Promise<any> {
    const breakItem = await this.breakService.create(payload);
    response.send(breakItem);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: BreakUpdateDto, @Res() response: Response): Promise<any> {
    const breakItem = await this.breakService.update(payload);
    response.send(breakItem);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const breakItem = await this.breakService.delete(id);
    response.send(breakItem);
  }
}
