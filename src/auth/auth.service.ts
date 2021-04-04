import { Injectable, UnauthorizedException, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from './../users/user.entity';
import { UsersService } from './../users/users.service';
import { LoginDto, ChangePasswordDto, ResetPasswordDTO } from './dto/index';
import { MailerService } from '@nestjs-modules/mailer';

type Token = {
  expiresIn: string | undefined;
  accessToken: string;
  user: Omit<User, 'password'>;
};
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async createToken(user: Omit<User, 'password'>): Promise<Token> {
    return {
      expiresIn: this.configService.get('jwt.ttl'),
      accessToken: this.jwtService.sign({ id: user.id }),
      user: user,
    };
  }

  async validateUser(payload: LoginDto): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getByEmailAndPass(payload.email, payload.password);
    if (!user) {
      throw new UnauthorizedException('Wrong login combination!');
    }

    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async sendResetPasswordEmail(payload: ResetPasswordDTO): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);

    if (!user) {
      throw new NotAcceptableException('User with this email not found!');
    }

    const newPassword = Math.random().toString(36).substr(2, 8) + Date.now();
    user.password = newPassword;
    await this.userService.update(user);

    this.mailerService
      .sendMail({
        to: payload.email,
        from: this.configService.get<string>('email.default'),
        subject: 'Nova lozinka za Dolazim.hr',
        template: 'reset-password',
        context: {
          user: user,
          newPassword: newPassword,
        },
      })
      .catch((error) => {
        console.log('🚀 ~ file: auth.service.ts ~ line 60 ~ AuthService ~ sendResetPasswordEmail ~ error', error);
        throw new Error('Email could not be sent. Please try again later.');
      });
  }

  async changePassword(payload: ChangePasswordDto): Promise<Omit<User, 'password'>> {
    const tokenPayload = this.jwtService.decode(payload.token);

    // jwtService.decode doesn't expose the right parameters/types.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await this.userService.get(tokenPayload.id);
    if (user) {
      const userWithCorrectPassword = await this.userService.getByEmailAndPass(user.email, payload.oldPassword);

      if (userWithCorrectPassword) {
        user.password = payload.password;
        const updatedUser = await this.userService.update(user);

        return updatedUser;
      } else {
        throw new UnauthorizedException('Incorrect old password!');
      }
    } else {
      throw new UnauthorizedException('Incorrect token!');
    }
  }
}
