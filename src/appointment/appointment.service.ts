import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { AppointmentCreateDto, AppointmentUpdateDto } from './dto/index';
import { Appointment } from './appointment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as ICS from 'ics';

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

  @Cron('*/2 * * * *')
  async sendAppointmentReminders(): Promise<Appointment[] | undefined> {
    const now = this.convertToCroatianTimezone(new Date());
    const appointments = await this.getAllOnDate(this.getDateString(now));

    if (appointments) {
      const appointmentsWithStaffEmail = appointments.filter(
        (item) => item.company.preferences.staffReminderEmail && !item.hasSentStaffEmail,
      );
      const appointmentsWithClientEmail = appointments.filter(
        (item) => item.company.preferences.clientReminderEmail && !item.hasSentCustomerEmail,
      );

      const appointmentsWithStaffEmailDue = appointmentsWithStaffEmail.filter((appointment) => {
        const appointmentDateTime = new Date(appointment.date + 'T' + appointment.time);

        if (appointmentDateTime.getTime() > now.getTime()) {
          const reminderDateTime = new Date(appointmentDateTime.getTime());

          reminderDateTime.setHours(reminderDateTime.getHours() - appointment.company.preferences.staffReminderTime);
          if (now.getTime() > reminderDateTime.getTime()) {
            return true;
          }
        }

        return false;
      });
      const appointmentsWithClientEmailDue = appointmentsWithClientEmail.filter((appointment) => {
        const appointmentDateTime = new Date(appointment.date + 'T' + appointment.time);

        if (appointmentDateTime.getTime() > now.getTime()) {
          const reminderDateTime = new Date(appointmentDateTime.getTime());

          reminderDateTime.setHours(reminderDateTime.getHours() - appointment.company.preferences.clientReminderTime);
          if (now.getTime() > reminderDateTime.getTime()) {
            return true;
          }
        }

        return false;
      });

      appointmentsWithStaffEmailDue.forEach((appointment) => {
        appointment.hasSentStaffEmail = true;
        this.appointmentRepository.save(appointment as Record<string, any>);

        if (appointment.staff.email) {
          // Send email to the staff
          this.mailerService
            .sendMail({
              to: appointment.staff.email,
              subject: 'Podsjetnik za termin u - ' + appointment.time,
              template: 'staff-reminder',
              context: {
                appointment: appointment,
              },
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

      appointmentsWithClientEmailDue.forEach((appointment) => {
        appointment.hasSentCustomerEmail = true;
        this.appointmentRepository.save(appointment as Record<string, any>);

        if (appointment.customer.email) {
          // Send email to the staff
          this.mailerService
            .sendMail({
              to: appointment.customer.email,
              subject: 'Podsjetnik za termin u - ' + appointment.time,
              template: 'client-reminder',
              context: {
                appointment: appointment,
              },
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

    return appointments;
  }

  convertToCroatianTimezone(date: Date): Date {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  }

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

  async getByCustomerId(id: number): Promise<Appointment[] | undefined> {
    return this.appointmentRepository.find({ relations: ['customer', 'service', 'staff'], where: { customer: id } });
  }

  async getByCompanyIdOnDate(id: number, dateString: string): Promise<Appointment[] | undefined> {
    return this.appointmentRepository.find({
      relations: ['customer', 'service', 'staff'],
      where: { company: id, date: dateString },
    });
  }

  async getByName(name: string): Promise<Appointment | undefined> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async getByCustomDate(
    companyID: number,
    customDates: { start: string; end: string },
  ): Promise<Appointment[] | undefined> {
    const startDateString = customDates.start;
    const endDateString = customDates.end;

    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.date >= :startDateString AND appointment.date <= :endDateString', {
        startDateString,
        endDateString,
      })
      .andWhere('appointment.company = :id', { id: companyID })
      .leftJoinAndSelect('appointment.service', 'service')
      .getMany();
  }

  async getAllOnDate(dateString: string): Promise<Appointment[] | undefined> {
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.date = :dateString', {
        dateString,
      })
      .leftJoinAndSelect('appointment.company', 'company')
      .leftJoinAndSelect('company.preferences', 'preferences')
      .andWhere('preferences.clientReminderEmail IS TRUE OR preferences.staffReminderEmail IS TRUE')
      .leftJoinAndSelect('appointment.service', 'service')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('appointment.staff', 'staff')
      .getMany();
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
          if (createdAppointment?.customer?.email) {
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
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', error);
                throw new Error('Email could not be sent. Please try again later.');
              });
          }

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

  async delete(id: number, isReschedule = false): Promise<Appointment> {
    console.log(
      '🚀 ~ file: appointment.service.ts ~ line 150 ~ AppointmentsService ~ delete ~ isReschedule',
      isReschedule,
    );
    const oldAppointment = await this.get(id);

    if (!oldAppointment) {
      throw new NotAcceptableException('Appointment does not exit.');
    }

    console.log(
      '🚀 ~ file: appointment.service.ts ~ line 161 ~ AppointmentsService ~ delete ~ oldAppointment?.customer.email',
      oldAppointment?.customer.email,
    );
    if (!isReschedule && oldAppointment?.customer.email) {
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
    }

    if (!isReschedule) {
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
    }

    return await this.appointmentRepository.remove(oldAppointment);
  }

  getDateString(date: Date): string {
    const dd = String(date.getDate());
    const mm = String(date.getMonth() + 1); //January is 0!
    const yyyy = date.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }
}
