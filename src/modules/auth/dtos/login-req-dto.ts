import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginReqDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
