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
import { DayOffCreateDto, DayOffUpdateDto } from './dto/index';
import { DayOffsService } from './dayOff.service';
import { DayOff } from './dayOff.entity';
import { Response } from 'express';

@Controller('dayOff')
@UseInterceptors(CacheInterceptor)
@ApiTags('dayOff')
export class DayOffsController {
  constructor(private readonly dayOffService: DayOffsService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const dayOff = await this.dayOffService.getAll();
    response.send(dayOff);
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const foundDayOff = await this.dayOffService.get(id);
    if (foundDayOff) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(foundDayOff);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: DayOffCreateDto, @Res() response: Response): Promise<any> {
    const dayOff = await this.dayOffService.create(payload);
    response.send(dayOff);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: DayOffUpdateDto, @Res() response: Response): Promise<any> {
    const dayOff = await this.dayOffService.update(payload);
    response.send(dayOff);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const dayOff = await this.dayOffService.delete(id);
    response.send(dayOff);
  }
}
