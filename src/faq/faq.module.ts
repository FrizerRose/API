import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { FaqController } from './faq.controller';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faq]), CommonModule],
  providers: [FaqService],
  controllers: [FaqController],
})
export class FaqModule {}
