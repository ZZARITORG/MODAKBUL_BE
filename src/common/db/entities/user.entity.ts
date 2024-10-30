import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import BaseTable from './base.entity';
import { Group } from './group.entity';
import { UserMeetingRelation } from './user-meeting-relation.entity';
import { FriendShip } from './friendship.entity';
import { Notification } from './notification.entitiy';

@Entity()
export class User extends BaseTable {
  @PrimaryColumn({ name: 'id', comment: '아이디' })
  id: string;

  @Column({ name: 'user_name', comment: '유저 이름' })
  name: string;

  @Column({ name: 'phone_no', comment: '전화번호' })
  phoneNo: string;

  @Column({ name: 'profile_url', comment: '프로필 URL', nullable: true })
  profileUrl: string;

  @Column({ name: 'fcm_token', comment: 'FCM 토큰' })
  fcmToken: string;

  @OneToMany(() => UserMeetingRelation, (userMeetingRelation) => userMeetingRelation.id)
  @JoinColumn({ name: 'meeting_relation_id' })
  meeetingRelation: UserMeetingRelation[];

  @OneToMany(() => FriendShip, (friendship) => friendship.id)
  @JoinColumn({ name: 'friendship_id' })
  friendship: FriendShip[];

  @OneToMany(() => Group, (group) => group.owner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  groups: Group[];

  @OneToMany(() => Notification, (notification) => notification.id)
  @JoinColumn({ name: 'notification_id' })
  notifications: Notification[];

  @ManyToOne(() => Group, (group) => group.members)
  @JoinColumn({ name: 'user_id' })
  group: Group;
}
