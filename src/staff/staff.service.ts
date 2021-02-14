import { CacheStore, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository, MoreThan } from 'typeorm';
import { CustomLoggerService } from '../common/CustomLoggerService';
import { StaffCreateDto } from './dto/index';
import { Staff } from './staff.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { StaffUpdateDto } from './dto';
import { Appointment } from 'src/appointment/appointment.entity';

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
    this.cacheStore.set('all_staff', staff, { ttl: 20 });

    this.logger.log('Querying all staff!');
    return staff;
  }

  async get(id: number): Promise<Staff | undefined> {
    const today = new Date();
    // const currentTime = today.getHours() + 1 + ':' + today.getMinutes() + ':' + today.getSeconds();
    const currentDate = this.getDateString(today);
    today.setDate(today.getDate() + 30);
    const monthFromNowDate = this.getDateString(today);

    return this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect(
        'staff.appointments',
        'appointment',
        'appointment.date >= :currentDate AND appointment.date < :monthFromNowDate',
        {
          currentDate,
          monthFromNowDate,
        },
      )
      .leftJoinAndSelect('appointment.service', 'service')
      .where('staff.id = :id', { id: id })
      .getOne();
  }

  async getByName(name: string): Promise<Staff | undefined> {
    return await this.staffRepository
      .createQueryBuilder('staff')
      .where('staff.name = :name')
      .setParameter('name', name)
      .getOne();
  }

  async create(payload: StaffCreateDto): Promise<Staff> {
    const staff = await this.staffRepository.save(this.staffRepository.create(payload as Record<string, any>));

    const toEmail = this.configService.get<string>('email.default');

    return staff;
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
