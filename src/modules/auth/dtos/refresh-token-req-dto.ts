import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenReqDto {
  @ApiProperty({ description: 'Refresh 토큰' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
