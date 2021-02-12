import { Body, CacheInterceptor, Controller, Get, Post, Put, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentCreateDto, AppointmentUpdateDto } from './dto/index';
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

  @Get(':id')
  findByID(@Param('id') id: number): Promise<Appointment | undefined> {
    return this.appointmentService.get(id);
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

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.appointmentService.delete(id);
  }
}
