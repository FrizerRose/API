import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Res,
  Put,
  Query,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { StaffCreateDto, StaffUpdateDto } from './dto/index';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';
import { response, Response } from 'express';

@Controller('staff')
@UseInterceptors(CacheInterceptor)
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const staff = this.staffService.getAll();
    response.send(staff);
  }

  @ApiQuery({
    name: 'start',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'end',
    required: false,
    type: String,
  })
  @Get(':id')
  async findByID(
    @Param('id') id: number,
    @Res() response: Response,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<void> {
    let staff: Staff | undefined;

    if (start && end) {
      staff = await this.staffService.get(id, { start, end });
    } else {
      staff = await this.staffService.get(id);
    }

    if (staff) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(staff);
  }

  @Get('company/:id')
  async findByCompanyID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const staff = await this.staffService.getByCompanyID(id);
    if (staff) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(staff);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: StaffCreateDto, @Res() response: Response): Promise<any> {
    const staff = await this.staffService.create(payload);
    response.send(staff);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: StaffUpdateDto, @Res() response: Response): Promise<any> {
    const staff = await this.staffService.update(payload);
    response.send(staff);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const staff = await this.staffService.delete(id);
    response.send(staff);
  }
}
