import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { StaffCreateDto } from './dto/index';
import { Staff } from './staff.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { StaffUpdateDto } from './dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private logger: CustomLoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheStore: CacheStore,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(): Promise<Staff[] | undefined> {
    let staff: Staff[] | undefined = await this.cacheStore.get('all_staff');

    if (staff) {
      this.logger.log('Getting all staff from cache.');
      return staff;
    }

    staff = await this.staffRepository.find({ relations: ['services'] });
    if (staff) {
      this.cacheStore.set('all_staff', staff, { ttl: 20 });
    }

    this.logger.log('Querying all staff!');
    return staff;
  }

  async getById(id: number): Promise<Staff | undefined> {
    return this.staffRepository.findOne(id, { relations: ['company'] });
  }

  async get(id: number, customDates?: { start: string; end: string }): Promise<Staff | undefined> {
    const staff = await this.getById(id);

    if (staff) {
      let startDateString;
      let endDateString;

      if (customDates) {
        const startDate = new Date(customDates.start);
        const endDate = new Date(customDates.end);

        startDateString = this.getDateString(startDate);
        endDateString = this.getDateString(endDate);
      } else {
        const schedulingWindow = staff.company.preferences.schedulingWindow || 30;
        const today = new Date();

        startDateString = this.getDateString(today);
        today.setDate(today.getDate() + schedulingWindow);
        endDateString = this.getDateString(today);
      }

      return this.staffRepository
        .createQueryBuilder('staff')
        .leftJoinAndSelect(
          'staff.appointments',
          'appointment',
          'appointment.date >= :startDateString AND appointment.date <= :endDateString',
          {
            startDateString,
            endDateString,
          },
        )
        .leftJoinAndSelect('appointment.service', 'service')
        .leftJoinAndSelect('appointment.customer', 'customer')
        .where('staff.id = :id', { id: id })
        .getOne();
    } else {
      return undefined;
    }
  }

  async getByCompanyID(id: number): Promise<Staff[] | undefined> {
    return await this.staffRepository.find({ relations: ['services', 'user'], where: { company: id } });
  }

  async getByEmail(email: string): Promise<Staff | undefined> {
    return await this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: StaffCreateDto): Promise<Staff> {
    const oldStaff = await this.getByEmail(payload.email);

    if (oldStaff) {
      throw new NotAcceptableException('Company with provided name already created.');
    }

    const staffData = payload;
    if (typeof payload.hours === 'string') {
      staffData.hours = JSON.parse(payload.hours);
    }

    return await this.staffRepository.save(this.staffRepository.create(staffData as Record<string, any>));
  }

  async update(payload: StaffUpdateDto): Promise<Staff> {
    const oldStaff = await this.get(payload.id);

    if (!oldStaff) {
      throw new NotAcceptableException('Staff with provided id not yet created.');
    }

    return await this.staffRepository.save(payload as Record<string, any>);
  }

  async delete(id: number): Promise<Staff> {
    const oldStaff = await this.get(id);

    if (!oldStaff) {
      throw new NotAcceptableException('Staff does not exit.');
    }

    return await this.staffRepository.remove(oldStaff);
  }

  getDateString(date: Date): string {
    const dd = String(date.getDate());
    const mm = String(date.getMonth() + 1); //January is 0!
    const yyyy = date.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }
}
