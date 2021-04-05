import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { DayOffsController } from './dayOff.controller';
import { DayOff } from './dayOff.entity';
import { DayOffsService } from './dayOff.service';

@Module({
  imports: [TypeOrmModule.forFeature([DayOff]), CommonModule],
  providers: [DayOffsService],
  controllers: [DayOffsController],
})
export class DayOffModule {}
