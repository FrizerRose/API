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

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'time' })
  time!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: false })
  hasSentStaffEmail!: boolean;

  @Column({ default: false })
  hasSentCustomerEmail!: boolean;

  @Column({ default: true })
  hasCustomerArrived!: boolean;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;

  @ManyToOne((type) => Staff, { onDelete: 'CASCADE' })
  @JoinColumn()
  staff!: Staff;

  @ManyToOne((type) => Service, { onDelete: 'CASCADE' })
  @JoinColumn()
  service!: Service;

  @ManyToOne((type) => Customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer!: Customer;
}
