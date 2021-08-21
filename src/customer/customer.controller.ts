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
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CustomerCreateDto, CustomerUpdateDto } from './dto/index';
import { CustomersService } from './customer.service';
import { Customer } from './customer.entity';
import { Response } from 'express';

@Controller('customer')
@UseInterceptors(CacheInterceptor)
@ApiTags('customer')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'company',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @Get()
  async findAll(
    @Res() response: Response,
    @Query('name') name?: string,
    @Query('company') company?: number,
    @Query('limit') limit?: number,
  ): Promise<any> {
    let customers;
    if (name && company) {
      customers = await this.customerService.findByName(name, company);
    } else if (company) {
      customers = await this.customerService.findByCompany(company);
    } else {
      if (limit) {
        customers = await this.customerService.getAll(limit);
      } else {
        customers = await this.customerService.getAll();
      }
    }

    response.send(customers);
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const customer = await this.customerService.get(id);
    if (customer) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(customer);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: CustomerCreateDto, @Res() response: Response): Promise<any> {
    const customer = await this.customerService.create(payload);
    response.send(customer);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: CustomerUpdateDto, @Res() response: Response): Promise<any> {
    const customer = await this.customerService.update(payload);
    response.send(customer);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const customer = await this.customerService.delete(id);
    response.send(customer);
  }
}
