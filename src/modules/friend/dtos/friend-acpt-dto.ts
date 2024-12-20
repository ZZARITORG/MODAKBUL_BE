import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FriendAcptDto {
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
