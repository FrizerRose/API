import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { CustomerCreateDto, CustomerUpdateDto } from './dto/index';
import { Customer } from './customer.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';

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

  async getAll(limit = 30): Promise<Customer[] | undefined> {
    let customer: Customer[] | undefined = await this.cacheStore.get('all_customer_' + limit);

    if (customer) {
      this.logger.log('Getting all customer from cache.');
      return customer;
    }

    customer = await this.customerRepository.find({ take: limit });
    this.cacheStore.set('all_customer_' + limit, customer, { ttl: 20 });

    this.logger.log('Querying all customer!');
    return customer;
  }

  async get(id: number): Promise<Customer | undefined> {
    return this.customerRepository.findOne(id);
  }

  async getByEmailAndCompanyID(email: string, companyID: number): Promise<Customer | undefined> {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.email = :email')
      .setParameter('email', email)
      .setParameter('company_id', companyID)
      .getOne();
  }

  async findByCompany(companyID: number): Promise<Customer[] | undefined> {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.company = :company_id')
      .setParameter('company_id', companyID)
      .getMany();
  }

  async findByName(name: string, companyID: number): Promise<Customer[] | undefined> {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .where('LOWER(customer.name) LIKE :name', { name: `${name.toLowerCase()}%` })
      .andWhere('customer.company = :company_id')
      .setParameter('company_id', companyID)
      .getMany();
  }

  async create(payload: CustomerCreateDto): Promise<Customer> {
    const oldCustomer = await this.getByEmailAndCompanyID(payload.email, payload.company);
    let customer: Customer;

    if (oldCustomer && payload.email !== '') {
      customer = await this.customerRepository.save({ id: oldCustomer.id, ...payload } as Record<string, any>);
    } else {
      customer = await this.customerRepository.save(this.customerRepository.create(payload as Record<string, any>));
    }

    return customer;
  }

  async update(payload: CustomerUpdateDto): Promise<Customer> {
    const oldCustomer = await this.get(payload.id);

    if (!oldCustomer) {
      throw new NotAcceptableException('Customer with provided id not yet created.');
    }

    return await this.customerRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Customer> {
    const oldCustomer = await this.get(id);

    if (!oldCustomer) {
      throw new NotAcceptableException('Customer does not exit.');
    }

    return await this.customerRepository.remove(oldCustomer);
  }
}
