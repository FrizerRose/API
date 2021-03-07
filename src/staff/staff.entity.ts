import { Appointment } from 'src/appointment/appointment.entity';
import { Company } from 'src/company/company.entity';
import { Service } from 'src/service/service.entity';
import { Image } from 'src/imageUpload/image.entity';
import WorkingHours from 'src/types/WorkingHours';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
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

  @Column({ type: 'simple-json' })
  hours!: WorkingHours;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;

  @ManyToMany(() => Service, (service) => service.staff, {
    cascade: true,
  })
  @JoinTable()
  services!: Service[];

  @OneToMany(() => Appointment, (appointment) => appointment.staff)
  appointments!: Appointment[];

  @OneToOne(() => Image, (image) => image.staff, {
    eager: true,
  })
  image?: Image;
}
