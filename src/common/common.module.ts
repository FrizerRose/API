import { Module } from '@nestjs/common';
import { CustomLoggerService } from './CustomLoggerService';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class CommonModule {}
