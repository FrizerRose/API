import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { ServiceCreateDto } from './dto/index';
import { Service } from './service.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Service[] | undefined> {
    let service: Service[] | undefined = await this.cacheStore.get('all_service');

    if (service) {
      this.logger.log('Getting all service from cache.');
      return service;
    }

    service = await this.serviceRepository.find();
    this.cacheStore.set('all_service', service, { ttl: 20 });

    this.logger.log('Querying all service!');
    return service;
  }

  async get(id: number): Promise<Service | undefined> {
    return this.serviceRepository.findOne(id);
  }

  async getByName(name: string): Promise<Service | undefined> {
    return await this.serviceRepository
      .createQueryBuilder('service')
      .where('service.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async create(payload: ServiceCreateDto): Promise<Service> {
    const service = await this.serviceRepository.save(this.serviceRepository.create(payload as Record<string, any>));

    return service;
  }
}
