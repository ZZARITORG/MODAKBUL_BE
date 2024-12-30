import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HyphenTel } from 'src/common/decorators/trans-phone-no.decorator';

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
  @HyphenTel()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty({ description: '프로필사진 URL' })
  @IsString()
  @IsNotEmpty()
  profileUrl: string;

  @ApiProperty({ description: 'FCM 토큰' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  fcmToken: string[];

  @ApiProperty({ description: '연락처 제공 동의' })
  @IsOptional()
  @IsBoolean()
  isContactAgree: boolean = false;
}
