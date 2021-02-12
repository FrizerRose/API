import { Appointment } from 'src/appointment/appointment.entity';
import { Company } from 'src/company/company.entity';
import { Staff } from 'src/staff/staff.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'service',
})
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  duration!: string;

  @Column({ length: 255 })
  price!: number;

  @ManyToOne((type) => Company)
  @JoinColumn()
  company!: Company;

  @ManyToMany(() => Staff, (staff) => staff.services)
  staff!: Staff[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments!: Appointment[];
}
