import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { BreakCreateDto, BreakUpdateDto } from './dto/index';
import { Break } from './break.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';

@Injectable()
export class BreaksService {
  constructor(
    @InjectRepository(Break)
    private readonly breakRepository: Repository<Break>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Break[] | undefined> {
    let breaks: Break[] | undefined = await this.cacheStore.get('all_break');

    if (breaks) {
      this.logger.log('Getting all breaks from cache.');
      return breaks;
    }

    breaks = await this.breakRepository.find();
    this.cacheStore.set('all_break', breaks, { ttl: 20 });

    this.logger.log('Querying all breaks!');
    return breaks;
  }

  async get(id: number): Promise<Break | undefined> {
    return this.breakRepository.findOne(id);
  }

  async create(payload: BreakCreateDto): Promise<Break> {
    return await this.breakRepository.save(this.breakRepository.create(payload as Record<string, any>));
  }

  async update(payload: BreakUpdateDto): Promise<Break> {
    const oldBreak = await this.get(payload.id);

    if (!oldBreak) {
      throw new NotAcceptableException('Break with provided id not yet created.');
    }

    return await this.breakRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Break> {
    const oldBreak = await this.get(id);

    if (!oldBreak) {
      throw new NotAcceptableException('Break does not exit.');
    }

    return await this.breakRepository.remove(oldBreak);
  }
}
