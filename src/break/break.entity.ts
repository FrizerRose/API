import { Staff } from 'src/staff/staff.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'break',
})
export class Break {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  start!: string;

  @Column({ type: 'date' })
  end!: string;

  @ManyToOne((type) => Staff, { onDelete: 'CASCADE' })
  @JoinColumn()
  staff!: Staff;
}
