import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'companyPreferences',
})
export class CompanyPreferences {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @OneToOne((type) => Company)
  @JoinColumn()
  company!: Company;
}
