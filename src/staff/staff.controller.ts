import { Body, CacheInterceptor, Controller, Get, Post, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaffCreateDto } from './dto/index';
import { StaffService } from './staff.service';
import { Staff } from './staff.entity';

@Controller('staff')
@UseInterceptors(CacheInterceptor)
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll(): Promise<Staff[] | undefined> {
    return this.staffService.getAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: StaffCreateDto): Promise<any> {
    return this.staffService.create(payload);
  }
}
