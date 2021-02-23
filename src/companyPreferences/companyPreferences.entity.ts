import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'companyPreferences',
})
export class CompanyPreferences {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 3 })
  leadTimeWindow!: number;

  @Column({ default: 30 })
  schedulingWindow!: number;

  @Column({ default: 2 })
  cancellationWindow!: number;

  @Column({ length: 255, default: '' })
  facebookLink!: string;

  @Column({ length: 255, default: '' })
  instagramLink!: string;

  @Column({ length: 255, default: '' })
  websiteLink!: string;

  @Column({ length: 255, default: '' })
  termsLink!: string;

  @Column({ default: true })
  hasStaffPick!: boolean;

  @Column({ length: 255, default: 'default' })
  colorVariant!: string;

  @OneToOne((type) => Company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company!: Company;
}
