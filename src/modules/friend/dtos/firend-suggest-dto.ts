import { ApiProperty } from '@nestjs/swagger';

export class FriendSuggestionDto {
  @ApiProperty({ description: '유저 UUID' })
  id: string;

  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '프로필 URL' })
  profileUrl: string;

  @ApiProperty({ description: '함께 아는 친구 수' })
  mutualFriendCount: number;
}
