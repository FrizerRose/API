import { Body, CacheInterceptor, Controller, Get, Post, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerCreateDto } from './dto/index';
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

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: CustomerCreateDto): Promise<any> {
    return this.customerService.create(payload);
  }
}
