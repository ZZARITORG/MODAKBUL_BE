import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FriendShip, FriendStatus } from 'src/common/db/entities/friendship.entity';
import { DataSource, Repository } from 'typeorm';
import { FriendReqDto } from '../friend/dtos/friend-req-dto';
import { User } from 'src/common/db/entities/user.entity';
import { FriendBlockDto } from '../friend/dtos/friend-block-dto';
import { FriendAcptDto } from '../friend/dtos/friend-acpt-dto';
import { FriendInfoDto } from '../friend/dtos/friend-info-dto';
import { FriendDeleteDto } from '../friend/dtos/friend-delete-dto';
import { Notification, NotificationType } from 'src/common/db/entities/notification.entitiy';
import { GetNotificationDto } from '../notification/dtos/notification-list-dto';
import { NotificationInfoDto } from '../notification/dtos/notification-info-dto';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  private readonly logger = new Logger(NotificationRepository.name);
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }
  async getNotification(getNotificationDto: GetNotificationDto, userId: string): Promise<NotificationInfoDto[]> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });

    const notifications = await this.find({
      where: { targetUser: { id: sourceUser.id } },
      relations: ['sourceUser'], // 알림을 보낸 사용자 정보도 가져오기
    });

    const notificationInfos = notifications.map((notification) => {
      return {
        id: notification.id,
        type: notification.type,
        sourceUserId: notification.sourceUser.userId,
        sourceUserName: notification.sourceUser.name,
      };
    });

    return notificationInfos; // 친구 정보 반환
  }
}
