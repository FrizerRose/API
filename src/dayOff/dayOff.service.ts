import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { DayOffCreateDto, DayOffUpdateDto } from './dto/index';
import { DayOff } from './dayOff.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';

@Injectable()
export class DayOffsService {
  constructor(
    @InjectRepository(DayOff)
    private readonly dayOffRepository: Repository<DayOff>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<DayOff[] | undefined> {
    let dayOffs: DayOff[] | undefined = await this.cacheStore.get('all_dayOff');

    if (dayOffs) {
      this.logger.log('Getting all dayOffs from cache.');
      return dayOffs;
    }

    dayOffs = await this.dayOffRepository.find();
    if (dayOffs) {
      this.cacheStore.set('all_dayOff', dayOffs, { ttl: 20 });
    }

    this.logger.log('Querying all dayOffs!');
    return dayOffs;
  }

  async get(id: number): Promise<DayOff | undefined> {
    return this.dayOffRepository.findOne(id);
  }

  async create(payload: DayOffCreateDto): Promise<DayOff> {
    return await this.dayOffRepository.save(this.dayOffRepository.create(payload as Record<string, any>));
  }

  async update(payload: DayOffUpdateDto): Promise<DayOff> {
    const oldDayOff = await this.get(payload.id);

    if (!oldDayOff) {
      throw new NotAcceptableException('DayOff with provided id not yet created.');
    }

    return await this.dayOffRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<DayOff> {
    const oldDayOff = await this.get(id);

    if (!oldDayOff) {
      throw new NotAcceptableException('DayOff does not exit.');
    }

    return await this.dayOffRepository.remove(oldDayOff);
  }
}
