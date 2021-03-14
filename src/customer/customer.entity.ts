import { Appointment } from 'src/appointment/appointment.entity';
import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'customer',
})
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, default: '' })
  email!: string;

  @Column({ length: 255, default: '' })
  phone!: string;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;

  @OneToMany(() => Appointment, (appointment) => appointment.customer)
  appointments!: Appointment[];
}
