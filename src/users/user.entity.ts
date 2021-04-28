import { Exclude } from 'class-transformer';
import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ default: false })
  isAdminAccount!: boolean;

  @ManyToOne(() => Company, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  company!: Company;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password?: string;
}
