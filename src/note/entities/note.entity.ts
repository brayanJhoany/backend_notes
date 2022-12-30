import { User } from '../../auth/entities/user.entity';
import { Transform } from 'class-transformer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment-timezone');

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.notes, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  @Transform((date1) => moment(date1).format('YYYY-MM-DD HH:mm:ss'))
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
