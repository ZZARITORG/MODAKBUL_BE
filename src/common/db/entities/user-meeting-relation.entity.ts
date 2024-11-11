import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';
import { Meeting } from './meeting.entity';

export enum MeetingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity()
export class UserMeetingRelation extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Meeting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.PENDING,
  })
  status: MeetingStatus;
}
