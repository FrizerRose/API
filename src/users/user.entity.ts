import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserPreferences } from '../userPreferences/userPreferences.entity';
import { PasswordTransformer } from './password.transformer';

// test comment
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ length: 255 })
  email!: string;

  @OneToOne(
    type => UserPreferences,
    preferences => preferences.user,
    {
      eager: true,
    },
  )
  preferences!: UserPreferences;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password!: string;
}
