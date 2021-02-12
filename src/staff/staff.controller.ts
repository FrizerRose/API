import { Body, CacheInterceptor, Controller, Get, Post, Put, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaffCreateDto, StaffUpdateDto } from './dto/index';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';

@Controller('staff')
@UseInterceptors(CacheInterceptor)
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll(): Promise<Staff[] | undefined> {
    return this.staffService.getAll();
  }

  @Get(':id')
  findByID(@Param('id') id: number): Promise<Staff | undefined> {
    return this.staffService.get(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: StaffCreateDto): Promise<any> {
    return this.staffService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: StaffUpdateDto): Promise<Staff> {
    return this.staffService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.staffService.delete(id);
  }
}
