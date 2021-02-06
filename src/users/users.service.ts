import { CacheStore, CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { RegisterDto, UpdateUserDto } from '../auth/dto';
import { LoggerService } from './../common/LoggerService';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async getAll(): Promise<User[] | undefined> {
    let users: User[] | undefined = await this.cacheStore.get('all_users');

    if (users) {
      this.logger.log('Getting all users from cache.');
      return users;
    }

    users = await this.usersRepository.find();
    this.cacheStore.set('all_users', users, { ttl: 20 });

    this.logger.log('Querying all users!');
    return users;
  }

  async get(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async getByEmailAndPass(email: string, password: string): Promise<User | undefined> {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', passHash)
      .getOne();
  }

  async getByEmailAndHashedPass(email: string, hashedPass: string): Promise<User | undefined> {
    console.log(email, hashedPass);
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email and users.password = :password')
      .setParameter('email', email)
      .setParameter('password', hashedPass)
      .getOne();
  }

  async create(payload: RegisterDto): Promise<User> {
    const oldUser = await this.getByEmail(payload.email);

    if (oldUser) {
      throw new NotAcceptableException('User with provided email already created.');
    }

    const newUser = await this.usersRepository.save(this.usersRepository.create(payload as Record<string, any>));
    // delete newUser.password;
    return newUser;
  }

  async update(payload: UpdateUserDto): Promise<User> {
    const oldUser = await this.get(payload.id);

    if (!oldUser) {
      throw new NotAcceptableException('User with provided id not yet created.');
    }

    const updatedUser = await this.usersRepository.save(payload);
    // delete updatedUser.password;
    return updatedUser;
  }

  async delete(id: number): Promise<User> {
    const oldUser = await this.get(id);

    if (!oldUser) {
      throw new NotAcceptableException('User does not exit.');
    }

    const deletedUser = await this.usersRepository.remove(oldUser);
    // delete deletedUser.password;
    return deletedUser;
  }
}
