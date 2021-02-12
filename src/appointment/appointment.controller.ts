import { Body, CacheInterceptor, Controller, Get, Post, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentCreateDto } from './dto/index';
import { AppointmentsService } from './appointment.service';
import { Appointment } from './appointment.entity';

@Controller('appointment')
@UseInterceptors(CacheInterceptor)
@ApiTags('appointment')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get()
  findAll(): Promise<Appointment[] | undefined> {
    return this.appointmentService.getAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: AppointmentCreateDto): Promise<any> {
    return this.appointmentService.create(payload);
  }
}
