import { Service } from 'src/service/service.entity';
import { Customer } from 'src/customer/customer.entity';
import { Staff } from 'src/staff/staff.entity';
import { Image } from 'src/imageUpload/image.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { CompanyPreferences } from 'src/companyPreferences/companyPreferences.entity';
import WorkingHours from 'src/types/WorkingHours';
import { Payment } from 'src/payments/payment.entity';
import { DayOff } from 'src/dayOff/dayOff.entity';

@Entity({
  name: 'company',
})
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ length: 255 })
  name!: string;

  @Column({ default: true })
  isPublic!: boolean;

  @Index()
  @Column({ length: 255, unique: true })
  bookingPageSlug!: string;

  @Column({ length: 255, default: '' })
  oib!: string;

  @Index()
  @Column({ length: 255, default: '', unique: true })
  contactEmail!: string;

  @Column({ length: 255, default: '' })
  streetName!: string;

  @Column({ length: 255, default: '' })
  city!: string;

  @Column({ length: 255, default: '' })
  phoneNumber!: string;

  @Column({ type: 'text', default: '' })
  about!: string;

  @Column({ default: false })
  hasSentTrialEndEmail!: boolean;

  @Column({ type: 'simple-json' })
  hours!: WorkingHours;

  @OneToMany((type) => User, (user) => user.company)
  users!: User[];

  @OneToOne((type) => CompanyPreferences, (preferences) => preferences.company, {
    cascade: true,
    eager: true,
  })
  preferences!: CompanyPreferences;

  @OneToMany(() => Customer, (customer) => customer.company)
  customers!: Customer[];

  @OneToMany(() => Service, (service) => service.company, {
    eager: true,
  })
  services!: Service[];

  @OneToMany(() => Staff, (staff) => staff.company, {
    eager: true,
  })
  staff!: Staff[];

  @OneToMany(() => Appointment, (appointment) => appointment.company)
  appointments!: Appointment[];

  @OneToMany(() => Payment, (payment) => payment.company)
  payments!: Payment[];

  @OneToOne(() => Image, (image) => image.company, {
    eager: true,
  })
  image?: Image;

  @OneToMany(() => DayOff, (timeOff) => timeOff.company, {
    eager: true,
    cascade: true,
  })
  daysOff!: DayOff[];
}
