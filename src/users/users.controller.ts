import { CacheInterceptor, Controller, Get, Res, Session, UseInterceptors } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Session() session: { id: string }, @Res() response: Response): Promise<any> {
    console.log('Session ID: ', session.id);
    const users = await this.usersService.getAll();
    response.send(users);
  }
}
