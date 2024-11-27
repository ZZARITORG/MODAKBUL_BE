import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FriendDeleteDto {
  @ApiProperty({ description: '요청보낸사람ID' })
  @IsNotEmpty()
  @IsString()
  target_id: string;
}
