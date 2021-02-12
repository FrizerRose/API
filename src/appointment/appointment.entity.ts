import { Company } from 'src/company/company.entity';
import { Customer } from 'src/customer/customer.entity';
import { Service } from 'src/service/service.entity';
import { Staff } from 'src/staff/staff.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'appointment',
})
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  datetime!: number;

  @Column({ type: 'text' })
  message!: string;

  @ManyToOne((type) => Company)
  @JoinColumn()
  company!: Company;

  @ManyToOne((type) => Staff)
  @JoinColumn()
  staff!: Staff;

  @ManyToOne((type) => Service)
  @JoinColumn()
  service!: Service;

  @ManyToOne((type) => Customer)
  @JoinColumn()
  customer!: Customer;
}
