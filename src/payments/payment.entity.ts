import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'payment',
})
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  // processing/paid/unpaid
  @Column({ default: 'processing' })
  status!: string;

  @Column({ type: 'date' })
  date!: string;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;
}
