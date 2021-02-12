import { Appointment } from 'src/appointment/appointment.entity';
import { Company } from 'src/company/company.entity';
import { Service } from 'src/service/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'staff',
})
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @ManyToOne((type) => Company)
  @JoinColumn()
  company!: Company;

  @ManyToMany(() => Service, (service) => service.staff, {
    cascade: true,
  })
  @JoinTable()
  services!: Service[];

  @OneToMany(() => Appointment, (appointment) => appointment.staff)
  appointments!: Appointment[];
}
