import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { CompanyPreferencesController } from './companyPreferences.controller';
import { CompanyPreferences } from './companyPreferences.entity';
import { CompanyPreferencesService } from './companyPreferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyPreferences]), CommonModule],
  providers: [CompanyPreferencesService],
  controllers: [CompanyPreferencesController],
})
export class CompanyPreferencesModule {}
