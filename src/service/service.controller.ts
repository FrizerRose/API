import { Body, CacheInterceptor, Controller, Get, Post, Put, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceCreateDto, ServiceUpdateDto } from './dto/index';
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

  @Get(':id')
  findByID(@Param('id') id: number): Promise<Service | undefined> {
    return this.serviceService.get(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: ServiceCreateDto): Promise<any> {
    return this.serviceService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: ServiceUpdateDto): Promise<Service> {
    return this.serviceService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.serviceService.delete(id);
  }
}
