import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { AppointmentCreateDto, AppointmentUpdateDto } from './dto/index';
import { Appointment } from './appointment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import * as ICS from 'ics';
import { writeFileSync, unlink } from 'fs';

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
    return this.appointmentRepository.findOne(id, { relations: ['staff', 'service', 'customer', 'company'] });
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

    if (appointment) {
      const createdAppointment = await this.get(appointment.id);
      const appointmentDate = new Date(createdAppointment?.date + 'T' + createdAppointment?.time);

      const event = {
        // start: [2018, 5, 30, 6, 30],
        start: [
          appointmentDate.getFullYear(),
          appointmentDate.getMonth() + 1,
          appointmentDate.getDate(),
          appointmentDate.getHours() - 1,
          appointmentDate.getMinutes(),
        ],
        duration: { minutes: createdAppointment?.service.duration },
        title: 'Rezervirani termin - ' + createdAppointment?.company.name,
        description: createdAppointment?.service.name,
        location: createdAppointment?.company.streetName + ', ' + createdAppointment?.company.city,
        status: 'CONFIRMED',
        organizer: { name: createdAppointment?.company.name, email: createdAppointment?.company.contactEmail },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ICS.createEvent(event, (error, value) => {
        if (error) {
          console.log(error);
        } else {
          console.log(value);
          // Send email to the customer
          this.mailerService
            .sendMail({
              to: createdAppointment?.customer.email,
              subject: 'Potvrda rezervacije termina - ' + createdAppointment?.company.name,
              template: 'customer-confirmation',
              context: {
                appointment: createdAppointment,
              },
              attachments: [
                {
                  filename: 'rezervacija.ics',
                  content: value,
                },
              ],
            })
            .catch((error) => {
              console.log(
                '🚀 ~ file: appointment.service.ts ~ line 99 ~ AppointmentsService ~ ICS.createEvent ~ error',
                error,
              );
              throw new Error('Email could not be sent. Please try again later.');
            });

          // Send email to the staff
          this.mailerService
            .sendMail({
              to: createdAppointment?.staff.email,
              subject: 'Novi termin za - ' + createdAppointment?.service.name,
              template: 'staff-confirmation',
              context: {
                appointment: createdAppointment,
              },
              attachments: [
                {
                  filename: 'rezervacija.ics',
                  content: value,
                },
              ],
            })
            .catch((error) => {
              console.log(
                '🚀 ~ file: appointment.service.ts ~ line 120 ~ AppointmentsService ~ ICS.createEvent ~ error',
                error,
              );
              throw new Error('Email could not be sent. Please try again later.');
            });
        }
      });
    }

    return appointment;
  }

  async update(payload: AppointmentUpdateDto): Promise<Appointment> {
    const oldAppointment = await this.get(payload.id);

    if (!oldAppointment) {
      throw new NotAcceptableException('Appointment with provided id not yet created.');
    }

    return await this.appointmentRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Appointment> {
    const oldAppointment = await this.get(id);

    if (!oldAppointment) {
      throw new NotAcceptableException('Appointment does not exit.');
    }
    console.log(
      '🚀 ~ file: appointment.service.ts ~ line 103 ~ AppointmentsService ~ delete ~ oldAppointment',
      oldAppointment,
    );

    // Send email to the customer
    this.mailerService
      .sendMail({
        to: oldAppointment?.customer.email,
        subject: 'Potvrda otkaza termina - ' + oldAppointment?.company.name,
        template: 'customer-cancel',
        context: {
          appointment: oldAppointment,
        },
      })
      .catch((error) => {
        throw new Error('Email could not be sent. Please try again later.');
      });

    // Send email to the staff
    this.mailerService
      .sendMail({
        to: oldAppointment?.staff.email,
        subject: 'Otkazan termin za - ' + oldAppointment?.service.name,
        template: 'staff-cancel',
        context: {
          appointment: oldAppointment,
        },
      })
      .catch((error) => {
        throw new Error('Email could not be sent. Please try again later.');
      });

    return await this.appointmentRepository.remove(oldAppointment);
  }
}
