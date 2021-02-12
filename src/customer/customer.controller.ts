import { Body, CacheInterceptor, Controller, Get, Post, Put, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerCreateDto, CustomerUpdateDto } from './dto/index';
import { CustomersService } from './customer.service';
import { Customer } from './customer.entity';

@Controller('customer')
@UseInterceptors(CacheInterceptor)
@ApiTags('customer')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get()
  findAll(): Promise<Customer[] | undefined> {
    return this.customerService.getAll();
  }

  @Get(':id')
  findByID(@Param('id') id: number): Promise<Customer | undefined> {
    return this.customerService.get(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: CustomerCreateDto): Promise<any> {
    return this.customerService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: CustomerUpdateDto): Promise<Customer> {
    return this.customerService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.customerService.delete(id);
  }
}
