import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpReqDto {
  @ApiProperty({ description: '아이디' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '전화번호' })
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty({ description: '프로필사진 URL' })
  @IsString()
  @IsNotEmpty()
  profileUrl: string;

  @ApiProperty({ description: 'FCM 토큰' })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
