import { Body, Controller, Get, Res, Post, Put, Delete, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AppointmentCreateDto, AppointmentUpdateDto } from './dto/index';
import { AppointmentsService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { Response } from 'express';

@Controller('appointment')
@ApiTags('appointment')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const appointments = await this.appointmentService.getAll();
    response.send(appointments);
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
  async create(@Body() payload: AppointmentCreateDto, @Res() response: Response): Promise<any> {
    const appointment = await this.appointmentService.create(payload);
    response.send(appointment);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: AppointmentUpdateDto, @Res() response: Response): Promise<any> {
    const appointment = await this.appointmentService.update(payload);
    response.send(appointment);
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
  async delete(
    @Res() response: Response,
    @Param('id') id: number,
    @Query('reschedule') reschedule?: string,
  ): Promise<any> {
    const appointment = await this.appointmentService.delete(id, reschedule === 'true' ? true : false);
    response.send(appointment);
  }
}
