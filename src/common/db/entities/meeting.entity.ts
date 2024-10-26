import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';

@Entity()
export class Meeting extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', comment: '제목' })
  title: string;

  @Column({ name: 'content', comment: '내용' })
  content: string;

  @Column({ name: 'host_id', comment: '호스트 아이디' })
  hostId: string;

  @Column({ name: 'location', comment: '위치' })
  location: string;

  @Column({ name: 'address', comment: '주소' })
  address: string;

  @Column({ name: 'detailAddress', comment: '상세 주소', nullable: true })
  detailAddress: string;

  @Column({ name: 'date', comment: '약속시간', type: 'timestamp' })
  date: Date;
}
