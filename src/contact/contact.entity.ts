import { Company } from 'src/company/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity({
  name: 'contact',
})
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ type: 'text' })
  body!: string;

  @ManyToOne((type) => Company, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  company?: Company;
}
