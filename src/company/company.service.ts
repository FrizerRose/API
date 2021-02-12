import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { CompanyCreateDto } from './dto/index';
import { Company } from './company.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompanysService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Company[] | undefined> {
    let company: Company[] | undefined = await this.cacheStore.get('all_company');

    if (company) {
      this.logger.log('Getting all company from cache.');
      return company;
    }

    company = await this.companyRepository.find();
    this.cacheStore.set('all_company', company, { ttl: 20 });

    this.logger.log('Querying all company!');
    return company;
  }

  async get(id: number): Promise<Company | undefined> {
    return this.companyRepository.findOne(id);
  }

  async getByName(name: string): Promise<Company | undefined> {
    return await this.companyRepository
      .createQueryBuilder('company')
      .where('company.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async create(payload: CompanyCreateDto): Promise<Company> {
    const company = await this.companyRepository.save(this.companyRepository.create(payload as Record<string, any>));

    return company;
  }
}
