import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '유저 ID', required: false })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({ description: '전화번호', required: false })
  @IsOptional()
  @IsString()
  phoneNo: string;

  @ApiProperty({ description: '유저 이름', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: '프로필 URL', required: false })
  @IsOptional()
  @IsString()
  profileUrl: string;

  @ApiProperty({ description: 'fcmToken', required: false })
  @IsOptional()
  @IsString()
  fcmToken: string;
}
