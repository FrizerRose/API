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
import { ServiceCreateDto, ServiceUpdateDto } from './dto/index';
import { ServicesService } from './service.service';
import { Service } from './service.entity';
import { Response } from 'express';

@Controller('service')
@UseInterceptors(CacheInterceptor)
@ApiTags('service')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const service = await this.serviceService.getAll();
    response.send(service);
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const service = await this.serviceService.get(id);
    if (service) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(service);
  }

  @Get('company/:id')
  async findByCompanyID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const services = await this.serviceService.getByCompanyID(id);
    if (services) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(services);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: ServiceCreateDto, @Res() response: Response): Promise<any> {
    const service = await this.serviceService.create(payload);
    response.send(service);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: ServiceUpdateDto, @Res() response: Response): Promise<any> {
    const service = await this.serviceService.update(payload);
    response.send(service);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const service = await this.serviceService.delete(id);
    response.send(service);
  }
}
