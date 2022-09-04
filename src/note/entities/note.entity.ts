import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
