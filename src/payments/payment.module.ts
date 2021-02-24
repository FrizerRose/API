import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { PaymentsController } from './payment.controller';
import { Payment } from './payment.entity';
import { PaymentsService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), CommonModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentModule {}
