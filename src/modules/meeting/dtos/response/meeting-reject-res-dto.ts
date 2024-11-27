import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MeetingStatus } from 'src/common/db/entities/user-meeting-relation.entity';

class UserResDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '사용자 계정명' })
  userId: string;

  @ApiProperty({ description: '사용자 이름' })
  name: string;

  @ApiProperty({ description: '프로필 이미지 URL' })
  profileUrl: string;
}

class MeetinResDto {
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
}

export class MeetingRejectResDto {
  @ApiProperty({ description: '미팅-유저 ID' })
  id: string;

  @ApiProperty({ description: '미팅 ID' })
  @IsEnum(MeetingStatus)
  status: MeetingStatus;

  @ApiProperty({ description: '미팅 정보' })
  meeting: MeetinResDto;

  @ApiProperty({ description: '참가자 정보' })
  user: UserResDto;
}
