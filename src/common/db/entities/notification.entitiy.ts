import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';

// 알림 유형을 정의하기 위한 enum
export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  GROUP_INVITATION = 'GROUP_INVITATION',
  MEETING_ALARM = 'MEETING_ALARM',
}

@Entity()
export class Notification extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType, comment: '알림 타입' })
  type: NotificationType;

  // @ManyToOne(() => User, (user) => user.notifications, {
  //   onDelete: 'CASCADE',
  // })

  // user: User; // 요청을 받은 사람의 UUID를 저장
  @ManyToOne(() => User, { nullable: false })
  sourceUser: User; // 친구 요청을 보낸 사람의 UUID를 저장

  @ManyToOne(() => User, { nullable: false })
  targetUser: User; // 친구 요청을 보낸 사람의 UUID를 저장

  @Column({ type: 'uuid', nullable: true }) // 약속 UUID를 저장 (null 가능)
  meetingId?: string; // 약속 UUID (선택 사항)
}
