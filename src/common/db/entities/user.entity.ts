import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { Group, GroupMember } from './group.entity';
import { UserMeetingRelation } from './user-meeting-relation.entity';
import { FriendShip } from './friendship.entity';
import { Notification } from './notification.entitiy';

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', comment: '아이디' })
  userId: string;

  @Column({ name: 'user_name', comment: '유저 이름' })
  name: string;

  @Column({ name: 'phone_no', comment: '전화번호' })
  phoneNo: string;

  @Column({ name: 'profile_url', comment: '프로필 URL', nullable: true })
  profileUrl: string;

  @Column({ name: 'fcm_token', comment: 'FCM 토큰' })
  fcmToken: string;

  @OneToMany(() => UserMeetingRelation, (userMeetingRelation) => userMeetingRelation.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_relation_id' })
  meetingRelation: UserMeetingRelation[];

  @OneToMany(() => FriendShip, (friendship) => friendship.id)
  @JoinColumn({ name: 'friendship_id' })
  friendship: FriendShip[];

  @OneToMany(() => Group, (group) => group.owner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  groups: Group[];

  @OneToMany(() => Notification, (notification) => notification.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notification_id' })
  notifications: Notification[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user, { onDelete: 'CASCADE' })
  groupMembers: GroupMember[];
}
