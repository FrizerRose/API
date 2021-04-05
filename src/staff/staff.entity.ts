import { Appointment } from 'src/appointment/appointment.entity';
import { Company } from 'src/company/company.entity';
import { Service } from 'src/service/service.entity';
import { Image } from 'src/imageUpload/image.entity';
import { Break } from 'src/break/break.entity';
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
import { User } from 'src/users/user.entity';

@Entity({
  name: 'staff',
})
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ default: true })
  isPublic!: boolean;

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

  @OneToOne(() => User, {
    // eager: true,
  })
  @JoinColumn()
  user?: User;

  @OneToOne(() => Image, (image) => image.staff, {
    eager: true,
  })
  image?: Image;

  @OneToMany(() => Break, (timeOff) => timeOff.staff, {
    eager: true,
    cascade: true,
  })
  breaks!: Break[];
}
