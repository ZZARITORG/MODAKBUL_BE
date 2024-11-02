import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';

@Entity()
export class Group extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', comment: '그룹명' })
  name: string;

  @ManyToOne(() => User, (user) => user.groups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  members: GroupMember[];
}

@Entity('group_member')
export class GroupMember extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User, (user) => user.groupMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
