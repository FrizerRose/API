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
    // return this.staffRepository.findOne(id, { relations: ['appointments'] });
    const secondsInAMonth = 2592000;
    return this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.appointments', 'appointment')
      .where('staff.id = :id', { id: id })
      .andWhere('appointment.datetime > :currentTimestamp', { currentTimestamp: Math.floor(Date.now() / 1000) })
      .andWhere('appointment.datetime < :monthFromNow', {
        monthFromNow: Math.floor(Date.now() / 1000) + secondsInAMonth,
      })
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
}
