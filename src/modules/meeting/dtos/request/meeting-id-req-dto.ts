import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MeetingIdReqDto {
  @ApiProperty({ description: '미팅 ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
