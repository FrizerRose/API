import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { CustomerCreateDto } from './dto/index';
import { Customer } from './customer.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Customer[] | undefined> {
    let customer: Customer[] | undefined = await this.cacheStore.get('all_customer');

    if (customer) {
      this.logger.log('Getting all customer from cache.');
      return customer;
    }

    customer = await this.customerRepository.find();
    this.cacheStore.set('all_customer', customer, { ttl: 20 });

    this.logger.log('Querying all customer!');
    return customer;
  }

  async get(id: number): Promise<Customer | undefined> {
    return this.customerRepository.findOne(id);
  }

  async getByName(name: string): Promise<Customer | undefined> {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async create(payload: CustomerCreateDto): Promise<Customer> {
    const customer = await this.customerRepository.save(this.customerRepository.create(payload as Record<string, any>));

    return customer;
  }
}
