import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { PaymentCreateDto, PaymentUpdateDto } from './dto/index';
import { Payment } from './payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Payment[] | undefined> {
    let payment: Payment[] | undefined = await this.cacheStore.get('all_payment');

    if (payment) {
      this.logger.log('Getting all payment from cache.');
      return payment;
    }

    payment = await this.paymentRepository.find();
    if (payment) {
      this.cacheStore.set('all_payment', payment, { ttl: 20 });
    }

    this.logger.log('Querying all payment!');
    return payment;
  }

  async get(id: number): Promise<Payment | undefined> {
    return this.paymentRepository.findOne(id);
  }

  async create(payload: PaymentCreateDto): Promise<Payment> {
    return await this.paymentRepository.save(this.paymentRepository.create(payload as Record<string, any>));
  }

  async update(payload: PaymentUpdateDto): Promise<Payment> {
    const oldPayment = await this.get(payload.id);

    if (!oldPayment) {
      throw new NotAcceptableException('Payment with provided id not yet created.');
    }

    return await this.paymentRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Payment> {
    const oldPayment = await this.get(id);

    if (!oldPayment) {
      throw new NotAcceptableException('Payment does not exit.');
    }

    return await this.paymentRepository.remove(oldPayment);
  }
}
