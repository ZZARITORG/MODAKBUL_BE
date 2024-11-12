import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import BaseTable from './base.entity';
import { User } from './user.entity';

@Entity()
export class FrequentFriend extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'source_id' })
  source: User; // 자주 만난 사람 (사용자)

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'target_id' })
  target: User; // 자주 만난 친구

  @Column({ type: 'int', default: 0 })
  count: number; // 자주 만난 횟수
}
