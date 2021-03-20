import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'faq',
})
export class Faq {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  question!: string;

  @Column({ type: 'text' })
  answer!: string;

  @Column({ type: 'text', default: '' })
  category!: string;

  @Column({ default: 0 })
  order!: number;
}
