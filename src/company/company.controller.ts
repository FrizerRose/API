import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CompanyCreateDto, CompanyUpdateDto } from './dto/index';
import { CompanysService } from './company.service';
import { Company } from './company.entity';

@Controller('company')
@UseInterceptors(CacheInterceptor)
@ApiTags('company')
export class CompanysController {
  constructor(private readonly companyService: CompanysService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<void> {
    const companies = await this.companyService.getAll();
    response.send(companies);
  }

  @Get('stats/:id')
  async getCompanyStats(@Param('id') companyId: number, @Res() response: Response): Promise<void> {
    const stats = await this.companyService.getStats(companyId);
    if (stats) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(stats);
  }

  @Get('barcode/:reference')
  async getCompanyBarcode(@Param('reference') reference: string, @Res() response: Response): Promise<void> {
    const barcode = await this.companyService.getBarcode(reference);
    if (barcode) {
      response.status(200);
      response.send(barcode);
    } else {
      response.status(400);
      response.send();
    }
  }

  @Get(':id')
  async findByID(@Param('id') id: number, @Res() response: Response): Promise<void> {
    const company = await this.companyService.get(id);
    if (company) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(company);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string, @Res() response: Response): Promise<void> {
    const company = await this.companyService.getBySlug(slug);
    if (company) {
      response.status(200);
    } else {
      response.status(404);
    }

    response.send(company);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: CompanyCreateDto, @Res() response: Response): Promise<any> {
    const company = await this.companyService.create(payload);
    response.send(company);
  }

  @Put()
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: CompanyUpdateDto, @Res() response: Response): Promise<any> {
    const company = await this.companyService.update(payload);
    response.send(company);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const company = await this.companyService.delete(id);
    response.send(company);
  }
}
