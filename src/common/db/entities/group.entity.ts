import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';

@Entity()
export class Group extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', comment: '그룹명' })
  name: string;

  @ManyToOne(() => User, (user) => user.groups)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => User, (user) => user.group)
  @JoinColumn({ name: 'member_id' })
  members: User[];
}
