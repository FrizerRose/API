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

  @Column({ default: true })
  hasStaffPick!: boolean;

  @Column({ default: true })
  canCancel!: boolean;

  @Column({ default: true })
  showRules!: boolean;

  @Column({ default: true })
  clientReminderEmail!: boolean;

  @Column({ default: true })
  staffReminderEmail!: boolean;

  @Column({ default: true })
  staffCancellationNotice!: boolean;

  @Column({ default: false })
  isTutorialFinished!: boolean;

  @Column({ default: 2 })
  clientReminderTime!: number;

  @Column({ default: 2 })
  staffReminderTime!: number;

  @Column({ length: 255, default: 'default' })
  colorVariant!: string;

  @Column({ length: 255, default: '' })
  facebookLink!: string;

  @Column({ length: 255, default: '' })
  instagramLink!: string;

  @Column({ length: 255, default: '' })
  websiteLink!: string;

  @Column({ length: 255, default: '' })
  termsLink!: string;

  @Column({ type: 'text', default: '' })
  rules!: string;

  @OneToOne((type) => Company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company!: Company;
}
