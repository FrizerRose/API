import { Service } from 'src/service/service.entity';
import { Customer } from 'src/customer/customer.entity';
import { Staff } from 'src/staff/staff.entity';
import { Image } from 'src/imageUpload/image.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { CompanyPreferences } from 'src/companyPreferences/companyPreferences.entity';
import WorkingHours from 'src/types/WorkingHours';
import { Payment } from 'src/payments/payment.entity';

@Entity({
  name: 'company',
})
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ default: true })
  isPublic!: boolean;

  @Column({ length: 255 })
  bookingPageSlug!: string;

  @Column({ length: 255, default: '' })
  contactEmail!: string;

  @Column({ length: 255, default: '' })
  streetName!: string;

  @Column({ length: 255, default: '' })
  city!: string;

  @Column({ length: 255, default: '' })
  phoneNumber!: string;

  @Column({ type: 'text', default: '' })
  about!: string;

  @Column({ type: 'simple-json' })
  hours!: WorkingHours;

  @OneToOne((type) => User, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

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
}
