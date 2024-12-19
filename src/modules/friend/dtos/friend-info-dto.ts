import { ApiProperty } from '@nestjs/swagger';

export class FriendInfoDto {
  @ApiProperty({ description: '유저 UUID' })
  id: string;

  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '프로필 URL' })
  profileUrl: string;
  @ApiProperty({ description: '업데이트된 시간' })
  updatedAt: Date;
  @ApiProperty({ description: '만들어진 시간' })
  createdAt: Date;
}
