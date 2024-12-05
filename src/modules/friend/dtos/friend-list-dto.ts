import { ApiProperty } from '@nestjs/swagger';

export class FriendListDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '프로필 URL' })
  profileUrl: string;

  @ApiProperty({ description: '자주만난 횟수' })
  count: number;

  @ApiProperty({ description: '업데이트된 시간' })
  updatedAt: Date;
}
