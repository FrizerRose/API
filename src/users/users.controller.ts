import { CacheInterceptor, Controller, Get, Res, Session, UseInterceptors } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Session() session: { id: string }): Promise<Omit<User, 'password'>[] | undefined> {
    console.log('Session ID: ', session.id);
    return this.usersService.getAll();
  }
}
