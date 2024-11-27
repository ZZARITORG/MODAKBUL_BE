import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '유저 ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '유저 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '프로필 URL' })
  @IsString()
  profileUrl: string;
}
