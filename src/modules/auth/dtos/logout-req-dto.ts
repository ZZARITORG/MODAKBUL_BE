import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutReqDto {
  @ApiProperty({ description: 'fcmToken' })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
