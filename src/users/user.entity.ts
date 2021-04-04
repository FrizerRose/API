import { Exclude } from 'class-transformer';
import { Company } from 'src/company/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserPreferences } from '../userPreferences/userPreferences.entity';
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

  @OneToOne((type) => UserPreferences, (preferences) => preferences.user, {
    eager: true,
    cascade: true,
  })
  preferences!: UserPreferences;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password?: string;
}
