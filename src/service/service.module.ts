import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { ServicesController } from './service.controller';
import { Service } from './service.entity';
import { ServicesService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), CommonModule],
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServiceModule {}
