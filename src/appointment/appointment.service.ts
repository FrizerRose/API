import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { AppointmentCreateDto } from './dto/index';
import { Appointment } from './appointment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Appointment[] | undefined> {
    let appointment: Appointment[] | undefined = await this.cacheStore.get('all_appointment');

    if (appointment) {
      this.logger.log('Getting all appointment from cache.');
      return appointment;
    }

    appointment = await this.appointmentRepository.find();
    this.cacheStore.set('all_appointment', appointment, { ttl: 20 });

    this.logger.log('Querying all appointment!');
    return appointment;
  }

  async get(id: number): Promise<Appointment | undefined> {
    return this.appointmentRepository.findOne(id);
  }

  async getByName(name: string): Promise<Appointment | undefined> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async create(payload: AppointmentCreateDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.save(
      this.appointmentRepository.create(payload as Record<string, any>),
    );

    return appointment;
  }
}
