import { Service } from 'src/service/service.entity';
import { Customer } from 'src/customer/customer.entity';
import { Staff } from 'src/staff/staff.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from 'src/appointment/appointment.entity';

@Entity({
  name: 'company',
})
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  bookingPageSlug!: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user!: User;

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
}
