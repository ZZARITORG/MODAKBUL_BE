import { ApiProperty } from '@nestjs/swagger';

export enum StatusResDto {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
  NONE = 'NONE',
}

export class GetOtherResDto {
  @ApiProperty({ description: '유저 uuid' })
  id: string;

  @ApiProperty({ description: '유저 아이디' })
  userId: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '휴대폰 번호' })
  phoneNO: string;

  @ApiProperty({ description: '프로필 URL' })
  profileUrl: string;

  @ApiProperty({ description: '친구 관계', enum: StatusResDto })
  status: StatusResDto;
}
