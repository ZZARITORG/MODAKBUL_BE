import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserIdReqDto {
  @ApiProperty({ description: '대상 유저 아이디' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
