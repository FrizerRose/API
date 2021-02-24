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
import { Response } from 'express';

@Controller('payment')
@UseInterceptors(CacheInterceptor)
@ApiTags('payment')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Get()
  findAll(): Promise<Payment[] | undefined> {
    return this.paymentService.getAll();
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
  create(@Body() payload: PaymentCreateDto): Promise<any> {
    return this.paymentService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: PaymentUpdateDto): Promise<Payment> {
    return this.paymentService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.paymentService.delete(id);
  }
}
