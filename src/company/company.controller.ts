import { Body, CacheInterceptor, Controller, Get, Post, UseInterceptors, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyCreateDto } from './dto/index';
import { CompanysService } from './company.service';
import { Company } from './company.entity';

@Controller('company')
@UseInterceptors(CacheInterceptor)
@ApiTags('company')
export class CompanysController {
  constructor(private readonly companyService: CompanysService) {}

  @Get()
  findAll(): Promise<Company[] | undefined> {
    return this.companyService.getAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() payload: CompanyCreateDto): Promise<any> {
    return this.companyService.create(payload);
  }
}
