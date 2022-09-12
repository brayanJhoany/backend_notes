import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column('bool', { default: true })
  isActive: boolean;
}
