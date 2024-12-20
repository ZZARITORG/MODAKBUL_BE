import { ApiProperty } from '@nestjs/swagger';

export class TokenResDto {
  @ApiProperty({ description: '액세스 토큰' })
  accessToken: string;

  @ApiProperty({ description: '액세스 토큰' })
  refreshToken: string;
}
