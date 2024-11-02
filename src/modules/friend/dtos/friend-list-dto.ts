import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetFriendsDto {
  @ApiProperty({ description: '유저 ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
