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
  findAll(): Promise<CompanyPreferences[] | undefined> {
    return this.companyPreferencesService.getAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: CompanyPreferencesCreateDto): Promise<any> {
    return this.companyPreferencesService.create(payload);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Body() payload: CompanyPreferencesUpdateDto): Promise<CompanyPreferences> {
    return this.companyPreferencesService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.companyPreferencesService.delete(id);
  }
}
