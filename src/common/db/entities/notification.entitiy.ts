import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';

@Entity()
export class Notification extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', comment: '제목' })
  title: string;

  @Column({ name: 'message', comment: '메시지' })
  message: string;

  @Column({ name: 'profile_url', comment: '프로필 URL', nullable: true })
  profileUrl: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: User;
}
