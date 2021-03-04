import { Body, Controller, Get, Post, Delete, Res, Req, Put, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateUserDto, ChangePasswordDto } from './dto/index';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginDto, @Res() response: Response): Promise<any> {
    const user = await this.authService.validateUser(payload);

    if (user && this.userService.userBelongsToCompany(user.id, payload.company)) {
      const token = await this.authService.createToken(user);
      response.status(200);
      response.send(token);
    } else {
      response.status(404);
      response.send();
    }
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() payload: RegisterDto): Promise<any> {
    const user = await this.userService.create(payload);
    return await this.authService.createToken(user);
  }

  @Put('update')
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: UpdateUserDto): Promise<any> {
    return await this.userService.update(payload);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id') id: number): Promise<any> {
    return this.userService.delete(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Req() request: Request): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.userService.get(request.user?.id);
  }

  @Post('reset-password/:email')
  @ApiResponse({ status: 200, description: 'Successfully sent email' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resetPassword(@Param('email') email: string): Promise<any> {
    return await this.authService.sendResetPasswordEmail(email);
  }

  @Post('change-password')
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Body() payload: ChangePasswordDto, @Res() response: Response): Promise<any> {
    try {
      const updatedUser = await this.authService.changePassword(payload);
      response.status(200);
      response.send(updatedUser);
    } catch {
      response.status(400);
      response.send();
    }
  }
}
