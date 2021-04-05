import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'dayOff',
})
export class DayOff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  start!: string;

  @Column({ type: 'date' })
  end!: string;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;
}
