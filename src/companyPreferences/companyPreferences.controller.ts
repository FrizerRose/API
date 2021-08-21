import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Res,
  Put,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyPreferencesCreateDto, CompanyPreferencesUpdateDto } from './dto/index';
import { CompanyPreferences } from './companyPreferences.entity';
import { CompanyPreferencesService } from './companyPreferences.service';
import { Response } from 'express';

@Controller('companyPreferences')
@UseInterceptors(CacheInterceptor)
@ApiTags('companyPreferences')
export class CompanyPreferencesController {
  constructor(private readonly companyPreferencesService: CompanyPreferencesService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const pref = await this.companyPreferencesService.getAll();
    response.send(pref);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: CompanyPreferencesCreateDto, @Res() response: Response): Promise<any> {
    const pref = await this.companyPreferencesService.create(payload);
    response.send(pref);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: CompanyPreferencesUpdateDto, @Res() response: Response): Promise<any> {
    const pref = await this.companyPreferencesService.update(payload);
    response.send(pref);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const pref = await this.companyPreferencesService.delete(id);
    response.send(pref);
  }
}
