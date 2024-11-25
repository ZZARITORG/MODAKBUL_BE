import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MeetingIdReqDto {
  @ApiProperty({ description: '대상 미팅 아이디' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
