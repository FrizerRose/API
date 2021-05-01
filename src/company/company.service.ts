import { CacheStore, CACHE_MANAGER, Inject, Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { CompanyCreateDto, CompanyUpdateDto } from './dto/index';
import { Company } from './company.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { CompanyPreferences } from 'src/companyPreferences/companyPreferences.entity';
import { AppointmentsService } from 'src/appointment/appointment.service';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class CompanysService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private httpService: HttpService,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly appointmentsService: AppointmentsService,
    private readonly staffService: StaffService,
  ) {}

  async getAll(): Promise<Company[] | undefined> {
    let company: Company[] | undefined = await this.cacheStore.get('all_company');

    if (company) {
      this.logger.log('Getting all company from cache.');
      return company;
    }

    company = await this.companyRepository.find();
    if (company) {
      this.cacheStore.set('all_company', company, { ttl: 20 });
    }

    this.logger.log('Querying all company!');
    return company;
  }

  async get(id: number): Promise<Company | undefined> {
    return await this.companyRepository
      .createQueryBuilder('company')
      .where('company.id = :id')
      .setParameter('id', id)
      .leftJoinAndSelect('company.preferences', 'preferences')
      .leftJoinAndSelect('company.staff', 'staff')
      .leftJoinAndSelect('company.image', 'image')
      .leftJoinAndSelect('company.daysOff', 'daysOff')
      .leftJoinAndSelect('company.payments', 'payments')
      .leftJoinAndSelect('company.services', 'services')
      .leftJoinAndSelect('services.staff', 'workers')
      .leftJoinAndSelect('workers.image', 'companyImage')
      .getOne();
  }

  async getBarcode(referenceString: string): Promise<any> {
    const response = await this.httpService
      .post(
        'https://hub3.bigfish.software/api/v1/barcode',
        {
          renderer: 'image',
          options: {
            format: 'png',
            color: '#000000',
          },
          data: {
            amount: 200,
            purpose: 'BEXP',
            description: 'Pretplata za Dolazim.hr',
            sender: {
              name: '',
              street: '',
              place: '',
            },
            receiver: {
              name: 'Snježana Prezimenka',
              street: 'Ulica Žalosnih vrba, 13',
              place: '10000, Zagreb',
              iban: 'HR1723600001101234565',
              model: '00',
              reference: referenceString,
            },
          },
        },
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: '*/*',
          },
        },
      )
      .toPromise();

    return await Buffer.from(response.data, 'binary').toString('base64');
  }

  async getStats(id: number): Promise<unknown> {
    const company = this.companyRepository.findOne(id);

    if (!company) {
      throw new NotAcceptableException('Company with provided id doesnt exist.');
    }

    const today = new Date();
    const weekFromNow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    const lastWeekAppointments =
      (await this.appointmentsService.getByCustomDate(id, {
        start: this.getDateString(weekAgo),
        end: this.getDateString(today),
      })) || [];
    const nextWeekAppointments =
      (await this.appointmentsService.getByCustomDate(id, {
        start: this.getDateString(today),
        end: this.getDateString(weekFromNow),
      })) || [];

    const stats = {
      lastWeekAppointmentCount: lastWeekAppointments.length,
      lastWeekAppointmentRevenue: lastWeekAppointments.reduce(
        (totalRevenue, appointment) => totalRevenue + appointment.service.price,
        0,
      ),
      nextWeekAppointmentCount: nextWeekAppointments.length,
      nextWeekAppointmentRevenue: nextWeekAppointments.reduce(
        (totalRevenue, appointment) => totalRevenue + appointment.service.price,
        0,
      ),
    };

    return stats;
  }

  async getByName(name: string): Promise<Company | undefined> {
    return await this.companyRepository
      .createQueryBuilder('company')
      .where('company.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async getWithUsers(id: number): Promise<Company | undefined> {
    return await this.companyRepository
      .createQueryBuilder('company')
      .where('company.id = :id')
      .setParameter('id', id)
      .leftJoinAndSelect('company.users', 'users')
      .getOne();
  }

  async getBySlug(slug: string): Promise<Company | undefined> {
    return await this.companyRepository
      .createQueryBuilder('company')
      .where('company.bookingPageSlug = :bookingPageSlug')
      .setParameter('bookingPageSlug', slug)
      .leftJoinAndSelect('company.preferences', 'preferences')
      .leftJoinAndSelect('company.staff', 'staff')
      .leftJoinAndSelect('company.image', 'image')
      .leftJoinAndSelect('company.daysOff', 'daysOff')
      .leftJoinAndSelect('company.payments', 'payments')
      .leftJoinAndSelect('company.services', 'services')
      .leftJoinAndSelect('services.staff', 'workers')
      .leftJoinAndSelect('workers.image', 'companyImage')
      .getOne();
  }

  async create(payload: CompanyCreateDto): Promise<Company> {
    const oldCompany = await this.getByName(payload.name);

    if (oldCompany) {
      throw new NotAcceptableException('Company with provided name already created.');
    }

    const newCompany = this.companyRepository.create(payload as Record<string, any>);
    newCompany.preferences = new CompanyPreferences();
    const company = await this.companyRepository.save(newCompany);

    // Create a staff for the admin account
    const companyWithUsers = await this.getWithUsers(company.id);
    if (companyWithUsers?.users[0]) {
      const user = companyWithUsers.users[0];
      this.staffService.create({
        name: user.name,
        email: user.email,
        isPublic: true,
        company: company.id,
        user: user.id,
        services: [],
        hours: JSON.stringify({
          monday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
          tuesday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
          wednesday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
          thursday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
          friday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
          saturday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
          sunday: { active: true, shifts: [{ start: '08:00', end: '16:00' }] },
        }),
      });
    }

    // Send email to the customer
    // this.mailerService
    //   .sendMail({
    //     to: company.contactEmail,
    //     subject: 'Dobrodošli na Dolazim.hr',
    //     template: 'welcome',
    //     context: {
    //       company: company,
    //     },
    //   })
    //   .catch((error) => {
    //     throw new Error('Email could not be sent. Please try again later.');
    //   });

    return company;
  }

  async update(payload: CompanyUpdateDto): Promise<Company> {
    const oldCompany = await this.get(payload.id);

    if (!oldCompany) {
      throw new NotAcceptableException('Company with provided id not yet created.');
    }

    return await this.companyRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Company> {
    const oldCompany = await this.get(id);

    if (!oldCompany) {
      throw new NotAcceptableException('Company does not exit.');
    }

    return await this.companyRepository.remove(oldCompany);
  }

  getDateString(date: Date): string {
    const dd = String(date.getDate());
    const mm = String(date.getMonth() + 1); //January is 0!
    const yyyy = date.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }
}
