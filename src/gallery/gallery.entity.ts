import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'gallery',
})
export class Gallery {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  images!: string;
}
