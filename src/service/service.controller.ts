import { Body, CacheInterceptor, Controller, Get, Post, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceCreateDto } from './dto/index';
import { ServicesService } from './service.service';
import { Service } from './service.entity';

@Controller('service')
@UseInterceptors(CacheInterceptor)
@ApiTags('service')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @Get()
  findAll(): Promise<Service[] | undefined> {
    return this.serviceService.getAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: ServiceCreateDto): Promise<any> {
    return this.serviceService.create(payload);
  }
}
