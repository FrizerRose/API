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
import { PaymentCreateDto, PaymentUpdateDto } from './dto/index';
import { PaymentsService } from './payment.service';
import { Payment } from './payment.entity';
import { response, Response } from 'express';

@Controller('payment')
@UseInterceptors(CacheInterceptor)
@ApiTags('payment')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const payment = await this.paymentService.getAll();
    response.send(payment);
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const payment = await this.paymentService.get(id);
    if (payment) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(payment);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: PaymentCreateDto, @Res() response: Response): Promise<any> {
    const payment = await this.paymentService.create(payload);
    response.send(payment);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: PaymentUpdateDto, @Res() response: Response): Promise<any> {
    const payment = await this.paymentService.update(payload);
    response.send(payment);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const payment = await this.paymentService.delete(id);
    response.send(payment);
  }
}
