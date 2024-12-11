import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class FriendBlockDto {
  @ApiProperty({ description: '요청받은사람ID' })
  @IsString()
  @IsNotEmpty()
  target_id: string;
}
