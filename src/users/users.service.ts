import { CacheStore, CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { RegisterDto, UpdateUserDto } from '../auth/dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private logger: CustomLoggerService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async getAll(): Promise<Omit<User, 'password'>[] | undefined> {
    let users: User[] | undefined = await this.cacheStore.get('all_users');

    if (users) {
      this.logger.log('Getting all users from cache.');
      return users;
    }

    users = await this.usersRepository.find({ take: 10 });
    users.forEach(
      (user: User): Omit<User, 'password'> => {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
      },
    );

    if (users) {
      this.cacheStore.set('all_users', users, { ttl: 20 });
    }

    this.logger.log('Querying all users!');
    return users;
  }

  async get(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(id, { relations: ['company'] });
    if (user) {
      const { password, ...sanitizedUser } = user;
      return sanitizedUser;
    }
    return user;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .leftJoinAndSelect('users.company', 'company')
      .getOne();
  }

  async getByEmailAndPass(email: string, password: string): Promise<User | undefined> {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .leftJoinAndSelect('users.company', 'company')
      .getOne();
  }

  async getByEmailAndHashedPass(email: string, hashedPass: string): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', hashedPass)
      .getOne();
  }

  async userBelongsToCompany(userEmail: string, companyID: number): Promise<boolean> {
    const user = await this.getByEmail(userEmail);
    if (user && user.company.id === companyID) {
      return true;
    }

    return false;
  }

  async create(payload: RegisterDto): Promise<Omit<User, 'password'>> {
    const oldUser = await this.getByEmail(payload.email);

    if (oldUser) {
      throw new NotAcceptableException('User with provided email already created.');
    }

    const newUser = this.usersRepository.create(payload as Record<string, any>);
    const user = await this.usersRepository.save(newUser);

    // Send welcome email to admin account
    if (!user.isAdminAccount) {
      const userWithCompany = await this.getByEmail(user.email);

      this.mailerService
        .sendMail({
          to: payload.email,
          from: this.configService.get<string>('email.default'),
          subject: 'Dobrodošli na Dolazim.hr',
          template: 'staff-welcome',
          context: {
            user: userWithCompany,
            newPassword: user.password,
          },
        })
        .catch((error) => {
          console.log('🚀 ~ file: users.service.ts ~ line 120 ~ UserService ~ create ~ error', error);
          throw new Error('Email could not be sent. Please try again later.');
        });
    }

    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async update(payload: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const oldUser = await this.get(payload.id);

    if (!oldUser) {
      throw new NotAcceptableException('User with provided id not yet created.');
    }

    const updatedUser = await this.usersRepository.save(payload);
    const { password, ...sanitizedUser } = updatedUser;
    return sanitizedUser;
  }

  async delete(id: number): Promise<Omit<User, 'password'>> {
    const oldUser = await this.get(id);

    if (!oldUser) {
      throw new NotAcceptableException('User does not exit.');
    }

    const deletedUser = await this.usersRepository.remove(oldUser);
    const { password, ...sanitizedUser } = deletedUser;
    return sanitizedUser;
  }
}
