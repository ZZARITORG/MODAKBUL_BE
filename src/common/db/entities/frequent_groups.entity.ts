import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';
import { Group } from './group.entity'; // 그룹 엔티티

@Entity()
export class FrequentGroup extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'source_id' })
  source: User; // 자주 만나는 사람 (사용자)

  @ManyToOne(() => Group, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  group: Group; // 자주 만나는 그룹

  @Column({ type: 'int', default: 0 })
  count: number; // 자주 만난 횟수
}
