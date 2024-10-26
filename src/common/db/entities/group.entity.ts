import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';

@Entity()
export class Group extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', comment: '그룹명' })
  name: string;

  @Column({ name: 'last_meeting_date', comment: '마지막모닥불 시간', nullable: true })
  lastMeetingDate: Date;

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  users: User[];
}
