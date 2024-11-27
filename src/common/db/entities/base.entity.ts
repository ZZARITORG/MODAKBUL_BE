import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

abstract class BaseTable {
  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    comment: '생성 시간',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'NULL',
    comment: '업데이트 시간',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
export default BaseTable;
