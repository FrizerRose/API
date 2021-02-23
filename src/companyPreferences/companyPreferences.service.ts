import { CacheStore, CACHE_MANAGER, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { CompanyPreferencesCreateDto, CompanyPreferencesUpdateDto } from './dto/index';
import { CompanyPreferences } from './companyPreferences.entity';

@Injectable()
export class CompanyPreferencesService {
  constructor(
    @InjectRepository(CompanyPreferences)
    private readonly companyPreferencesRepository: Repository<CompanyPreferences>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
  ) {}

  async getAll(): Promise<CompanyPreferences[] | undefined> {
    let companyPreferences: CompanyPreferences[] | undefined = await this.cacheStore.get('all_companyPreferences');

    if (companyPreferences) {
      this.logger.log('Getting all companyPreferences from cache.');
      return companyPreferences;
    }

    companyPreferences = await this.companyPreferencesRepository.find();
    this.cacheStore.set('all_companyPreferences', companyPreferences, { ttl: 20 });

    this.logger.log('Querying all companyPreferences!');
    return companyPreferences;
  }

  async get(id: number): Promise<CompanyPreferences | undefined> {
    return this.companyPreferencesRepository.findOne(id);
  }

  async create(payload: CompanyPreferencesCreateDto): Promise<CompanyPreferences> {
    return await this.companyPreferencesRepository.save(
      this.companyPreferencesRepository.create(payload as Record<string, any>),
    );
  }

  async update(payload: CompanyPreferencesUpdateDto): Promise<CompanyPreferences> {
    const oldCompanyPreferences = await this.get(payload.id);

    if (!oldCompanyPreferences) {
      throw new NotAcceptableException('CompanyPreferences with provided id not yet created.');
    }

    return await this.companyPreferencesRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<CompanyPreferences> {
    const oldCompanyPreferences = await this.get(id);

    if (!oldCompanyPreferences) {
      throw new NotAcceptableException('CompanyPreferences does not exit.');
    }

    return await this.companyPreferencesRepository.remove(oldCompanyPreferences);
  }
}
