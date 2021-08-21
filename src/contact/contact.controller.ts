import { Body, CacheInterceptor, Controller, Get, Post, UseInterceptors, Delete, Param, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactCreateDto } from './dto/index';
import { ContactsService } from './contact.service';
import { Contact } from './contact.entity';
import { Response } from 'express';

@Controller('contact')
@UseInterceptors(CacheInterceptor)
@ApiTags('contact')
export class ContactsController {
  constructor(private readonly contactService: ContactsService) {}

  @Get()
  async findAll(@Res() response: Response): Promise<any> {
    const contact = await this.contactService.getAll();
    response.send(contact);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: ContactCreateDto, @Res() response: Response): Promise<any> {
    const contact = await this.contactService.create(payload);
    response.send(contact);
  }
}
