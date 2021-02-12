import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { CustomersController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomersService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CommonModule],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomerModule {}
