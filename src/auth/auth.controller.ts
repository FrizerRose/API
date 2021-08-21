import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto, ResetPasswordDTO, UpdateUserDto } from './dto/index';

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
    const userBelongsToCompany = await this.userService.userBelongsToCompany(user.email, payload.company);

    if (user && userBelongsToCompany) {
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
  async create(@Body() payload: RegisterDto, @Res() response: Response): Promise<any> {
    const user = await this.userService.create(payload);
    const token = await this.authService.createToken(user);
    response.send(token);
  }

  @Put('update')
  @ApiResponse({ status: 200, description: 'Successful update' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Body() payload: UpdateUserDto, @Res() response: Response): Promise<any> {
    const user = await this.userService.update(payload);
    response.send(user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful deletion' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: number, @Res() response: Response): Promise<any> {
    const user = await this.userService.delete(id);
    response.send(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Req() request: Request, @Res() response: Response): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await this.userService.get(request.user?.id);
    response.send(user);
  }

  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Successfully sent email' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resetPassword(@Body() payload: ResetPasswordDTO, @Res() response: Response): Promise<any> {
    const emptyObject = await await this.authService.sendResetPasswordEmail(payload);
    response.send(emptyObject);
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
