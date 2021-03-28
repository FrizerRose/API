import { CacheStore, CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { UserPreferences } from 'src/userPreferences/userPreferences.entity';
import { Repository } from 'typeorm';
import { RegisterDto, UpdateUserDto } from '../auth/dto';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private logger: CustomLoggerService,
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
    const user = await this.usersRepository.findOne(id);
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

  async userBelongsToCompany(userID: number, companyID: number): Promise<boolean> {
    const user = await this.usersRepository.findOne(userID);
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
    newUser.preferences = new UserPreferences();
    //add default preferences
    newUser.preferences.name = 'Marko';
    const user = await this.usersRepository.save(newUser);

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
