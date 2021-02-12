import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { StaffController } from './staff.controller';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff]), CommonModule],
  providers: [StaffService],
  controllers: [StaffController],
})
export class StaffModule {}
