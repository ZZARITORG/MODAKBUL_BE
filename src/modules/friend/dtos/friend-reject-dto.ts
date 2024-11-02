import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FriendStatus } from 'src/common/db/entities/friendship.entity';
export class FriendRejectDto {
  @ApiProperty({ description: '요청보낸사람ID' })
  @IsString()
  @IsNotEmpty()
  source_id: string;

  @ApiProperty({ description: '요청받은사람ID' })
  @IsString()
  @IsNotEmpty()
  target_id: string;

  //   @ApiProperty({
  //     description: '친구 상태',
  //     enum: FriendStatus,
  //   })
  //   @IsEnum(FriendStatus)
  //   @IsNotEmpty()
  //   status: FriendStatus;
}
