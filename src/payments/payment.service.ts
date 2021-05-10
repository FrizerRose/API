import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { PaymentCreateDto, PaymentUpdateDto } from './dto/index';
import { Payment } from './payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { Company } from 'src/company/company.entity';

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
    const payment = await this.paymentRepository.save(this.paymentRepository.create(payload as Record<string, any>));
    const toEmail = this.configService.get<string>('email.default');

    this.mailerService
      .sendMail({
        to: toEmail,
        subject: 'Nova uplata sa Dolazim.hr',
        template: './new-payment',
        context: {
          payment: payment,
        },
      })
      .catch((error) => {
        throw new Error('Email could not be sent. Please try again later.');
      });

    return payment;
  }

  async update(payload: PaymentUpdateDto): Promise<Payment> {
    const oldPayment = await this.get(payload.id);

    if (!oldPayment) {
      throw new NotAcceptableException('Payment with provided id not yet created.');
    }

    const updatedPayment = await this.paymentRepository.save(payload as Record<string, any>);

    // if (oldPayment.status === 'processing' && updatedPayment.status === 'paid') {
    //   this.mailerService
    //     .sendMail({
    //       to: updatedPayment.company.contactEmail,
    //       subject: 'Hvala na uplati sa Dolazim.hr',
    //       template: './payment-confirmation',
    //       context: {
    //         payment: updatedPayment,
    //       },
    //     })
    //     .catch((error) => {
    //       throw new Error('Email could not be sent. Please try again later.');
    //     });
    // }

    return updatedPayment;
  }

  async delete(id: number): Promise<Payment> {
    const oldPayment = await this.get(id);

    if (!oldPayment) {
      throw new NotAcceptableException('Payment does not exit.');
    }

    return await this.paymentRepository.remove(oldPayment);
  }
}
