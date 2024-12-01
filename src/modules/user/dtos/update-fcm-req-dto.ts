import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFcmReqDto {
  @ApiProperty({ description: '휴대폰 번호' })
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty({ description: 'FCM 토큰' })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
