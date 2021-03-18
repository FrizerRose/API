import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { FaqCreateDto } from './dto/index';
import { Faq } from './faq.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { FaqUpdateDto } from './dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Faq[] | undefined> {
    let faq: Faq[] | undefined = await this.cacheStore.get('all_faq');

    if (faq) {
      this.logger.log('Getting all faq from cache.');
      return faq;
    }

    faq = await this.faqRepository.find();
    this.cacheStore.set('all_faq', faq, { ttl: 20 });

    this.logger.log('Querying all faq!');
    return faq;
  }

  async get(id: number): Promise<Faq | undefined> {
    return this.faqRepository.findOne(id);
  }
  async create(payload: FaqCreateDto): Promise<Faq> {
    return await this.faqRepository.save(this.faqRepository.create(payload as Record<string, any>));
  }

  async update(payload: FaqUpdateDto): Promise<Faq> {
    const oldFaq = await this.get(payload.id);

    if (!oldFaq) {
      throw new NotAcceptableException('Faq with provided id not yet created.');
    }

    return await this.faqRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Faq> {
    const oldFaq = await this.get(id);

    if (!oldFaq) {
      throw new NotAcceptableException('Faq does not exit.');
    }

    return await this.faqRepository.remove(oldFaq);
  }
}
