import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeStatusMeetingReqDto {
  @ApiProperty({ description: '모닥불ID' })
  @IsString()
  @IsNotEmpty()
  meetingId: string;
}
