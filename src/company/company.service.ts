import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { CompanyCreateDto, CompanyUpdateDto } from './dto/index';
import { Company } from './company.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { CompanyPreferences } from 'src/companyPreferences/companyPreferences.entity';

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

  async getBySlug(slug: string): Promise<Company | undefined> {
    return this.companyRepository.findOne({ where: { bookingPageSlug: slug } });
  }

  async create(payload: CompanyCreateDto): Promise<Company> {
    const oldCompany = await this.getByName(payload.name);

    if (oldCompany) {
      throw new NotAcceptableException('Company with provided name already created.');
    }

    const newCompany = this.companyRepository.create(payload as Record<string, any>);
    newCompany.preferences = new CompanyPreferences();
    const company = await this.companyRepository.save(newCompany);

    return company;
  }

  async update(payload: CompanyUpdateDto): Promise<Company> {
    const oldCompany = await this.get(payload.id);

    if (!oldCompany) {
      throw new NotAcceptableException('Company with provided id not yet created.');
    }

    return await this.companyRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Company> {
    const oldCompany = await this.get(id);

    if (!oldCompany) {
      throw new NotAcceptableException('Company does not exit.');
    }

    return await this.companyRepository.remove(oldCompany);
  }
}
