import { ApiProperty } from '@nestjs/swagger';
import { MeetingStatus } from 'src/common/db/entities/user-meeting-relation.entity';

class UserMeetingRelationDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '사용자 계정명' })
  userId: string;

  @ApiProperty({ description: '사용자 이름' })
  name: string;

  @ApiProperty({ description: '프로필 이미지 URL' })
  profileUrl: string;

  @ApiProperty({ description: '차단여부' })
  isBlocked: boolean;

  @ApiProperty({
    description: '참가 상태',
    enum: MeetingStatus,
  })
  status: string;
}

export class DetailMeetingResDto {
  @ApiProperty({ description: '미팅 ID' })
  id: string;

  @ApiProperty({ description: '미팅 제목' })
  title: string;

  @ApiProperty({ description: '미팅 내용' })
  content: string;

  @ApiProperty({ description: '호스트 ID' })
  hostId: string;

  @ApiProperty({ description: '미팅 장소' })
  location: string;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '상세 주소' })
  detailAddress: string;

  @ApiProperty({ description: '미팅 날짜 및 시간' })
  date: Date;

  @ApiProperty({ description: '위도' })
  lat: number;

  @ApiProperty({ description: '경도' })
  lng: number;

  @ApiProperty({ description: '그룸명 혹은 그룹인원' })
  groupName: string;

  @ApiProperty({
    description: '참가자 관계 정보',
    type: [UserMeetingRelationDto],
  })
  user: UserMeetingRelationDto[];
}
