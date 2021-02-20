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
import { CustomerCreateDto, CustomerUpdateDto } from './dto/index';
import { CustomersService } from './customer.service';
import { Customer } from './customer.entity';
import { Response } from 'express';

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
