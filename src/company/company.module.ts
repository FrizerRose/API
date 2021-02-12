import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { CompanysController } from './company.controller';
import { Company } from './company.entity';
import { CompanysService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CommonModule],
  providers: [CompanysService],
  controllers: [CompanysController],
})
export class CompanyModule {}
