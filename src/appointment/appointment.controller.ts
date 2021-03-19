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
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AppointmentCreateDto, AppointmentUpdateDto } from './dto/index';
import { AppointmentsService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { Response } from 'express';

@Controller('appointment')
@UseInterceptors(CacheInterceptor)
@ApiTags('appointment')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get()
  findAll(): Promise<Appointment[] | undefined> {
    return this.appointmentService.getAll();
  }

  @Get('test')
  async testCron(): Promise<Appointment[] | undefined> {
    return this.appointmentService.sendAppointmentReminders();
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const appointment = await this.appointmentService.get(id);
    if (appointment) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(appointment);
  }

  @Get('customer/:id')
  async findByCustomerID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const appointments = await this.appointmentService.getByCustomerId(id);
    if (appointments) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(appointments);
  }

  @Get('company/:id/:date')
  async findByCompanyID(
    @Param('id') id: number,
    @Param('date') date: string,
    @Res() response: Response,
  ): Promise<void> {
    const appointments = await this.appointmentService.getByCompanyIdOnDate(id, date);
    if (appointments) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(appointments);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: AppointmentCreateDto): Promise<any> {
    return this.appointmentService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: AppointmentUpdateDto): Promise<Appointment> {
    return this.appointmentService.update(payload);
  }

  @ApiQuery({
    name: 'reschedule',
    required: false,
    type: String,
  })
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number, @Query('reschedule') reschedule?: string): Promise<any> {
    console.log(
      '🚀 ~ file: appointment.controller.ts ~ line 69 ~ AppointmentsController ~ delete ~ reschedule',
      reschedule,
      typeof reschedule,
    );
    return this.appointmentService.delete(id, reschedule === 'true' ? true : false);
  }
}
