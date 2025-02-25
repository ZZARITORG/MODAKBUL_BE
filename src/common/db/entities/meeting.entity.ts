import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import BaseTable from './base.entity';
import { UserMeetingRelation } from './user-meeting-relation.entity';

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

  @Column({ name: 'location', comment: '장소명' })
  location: string;

  @Column({ name: 'address', comment: '도로명주소' })
  address: string;

  @Column({ name: 'detailAddress', comment: '상세 주소', nullable: true })
  detailAddress: string;

  @Column({ name: 'date', comment: '약속시간', type: 'timestamp' })
  date: Date;

  @Column({ name: 'lat', comment: '위도', type: 'decimal', precision: 10, scale: 8 })
  lat: number;

  @Column({ name: 'lng', comment: '경도', type: 'decimal', precision: 11, scale: 8 })
  lng: number;

  @Column({ name: 'group_name', comment: '그룹명 혹은 참여인원' })
  groupName: string;

  @OneToMany(() => UserMeetingRelation, (userMeetingRelation) => userMeetingRelation.meeting, { onDelete: 'CASCADE' })
  userMeetingRelations: UserMeetingRelation[];
}
