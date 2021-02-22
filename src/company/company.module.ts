import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { CompanysController } from './company.controller';
import { Company } from './company.entity';
import { CompanysService } from './company.service';
import { CompanyPreferencesModule } from '../companyPreferences/companyPreferences.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CommonModule, CompanyPreferencesModule],
  providers: [CompanysService],
  controllers: [CompanysController],
})
export class CompanyModule {}
