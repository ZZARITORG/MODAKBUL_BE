import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NotificationType } from 'src/common/db/entities/notification.entitiy';

export class NotificationInfoDto {
  @ApiProperty({
    description: '알림타입',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;
  @ApiProperty({ description: '보낸사람유저아이디' })
  sourceUserId: string;
  @ApiProperty({ description: '보낸사람유저이름' })
  sourceUserName: string;
  @ApiProperty({ description: '보낸사람유저프로필URL' })
  sourceUserProfileUrl: string;
  @ApiProperty({ description: '만들어진 시간' })
  createdAt: Date;
  @ApiProperty({ description: '만들어진 시간' })
  meetingId: string;
}
