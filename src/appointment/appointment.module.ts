import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { AppointmentsController } from './appointment.controller';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), CommonModule],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentModule {}
