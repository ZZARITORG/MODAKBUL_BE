import { ApiProperty } from '@nestjs/swagger';

export class GetUserResDto {
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
  @ApiProperty({ description: 'FCM TOKEN' })
  fcmToken: string;
  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;
  @ApiProperty({ description: '업데이트 시간' })
  updatedAt: Date;
}
