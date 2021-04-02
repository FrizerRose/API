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

  @Column()
  duration!: number;

  @Column()
  price!: number;

  @Column({ length: 255, default: 'both' })
  sex!: string;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;

  @ManyToMany(() => Staff, (staff) => staff.services, {
    eager: true,
  })
  staff!: Staff[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments!: Appointment[];
}
