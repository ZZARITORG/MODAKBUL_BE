import { ApiProperty } from '@nestjs/swagger';

export class FriendInfoDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '프로필 URL' })
  profileUrl: string;
}
