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
}
