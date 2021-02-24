import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { BreaksController } from './break.controller';
import { Break } from './break.entity';
import { BreaksService } from './break.service';

@Module({
  imports: [TypeOrmModule.forFeature([Break]), CommonModule],
  providers: [BreaksService],
  controllers: [BreaksController],
})
export class BreakModule {}
