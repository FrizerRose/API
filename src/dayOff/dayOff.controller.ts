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
  findAll(): Promise<DayOff[] | undefined> {
    return this.dayOffService.getAll();
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
  create(@Body() payload: DayOffCreateDto): Promise<any> {
    return this.dayOffService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: DayOffUpdateDto): Promise<DayOff> {
    return this.dayOffService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.dayOffService.delete(id);
  }
}
