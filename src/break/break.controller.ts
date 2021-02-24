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
import { Response } from 'express';

@Controller('break')
@UseInterceptors(CacheInterceptor)
@ApiTags('break')
export class BreaksController {
  constructor(private readonly breakService: BreaksService) {}

  @Get()
  findAll(): Promise<Break[] | undefined> {
    return this.breakService.getAll();
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
  create(@Body() payload: BreakCreateDto): Promise<any> {
    return this.breakService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: BreakUpdateDto): Promise<Break> {
    return this.breakService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.breakService.delete(id);
  }
}
