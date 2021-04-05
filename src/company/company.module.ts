import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { CompanysController } from './company.controller';
import { Company } from './company.entity';
import { CompanysService } from './company.service';
import { CompanyPreferencesModule } from '../companyPreferences/companyPreferences.module';
import { StaffModule } from '../staff/staff.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    CommonModule,
    CompanyPreferencesModule,
    AppointmentModule,
    StaffModule,
  ],
  providers: [CompanysService],
  controllers: [CompanysController],
})
export class CompanyModule {}
