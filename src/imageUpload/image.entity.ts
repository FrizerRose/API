import { Company } from 'src/company/company.entity';
import { Staff } from 'src/staff/staff.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'image',
})
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  link!: string;

  @OneToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company?: Company;

  @OneToOne((type) => Staff, { onDelete: 'CASCADE' })
  @JoinColumn()
  staff?: Staff;
}
