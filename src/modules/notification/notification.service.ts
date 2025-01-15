import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationInfoDto } from './dtos/notification-info-dto';
import { NotificationType } from 'src/common/db/entities/notification.entitiy';
import { SseService } from './sse.service';
import { FcmService } from './fcm.service';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
    private readonly sseService: SseService,
    private readonly fcmService: FcmService,
  ) {}

  async notificationList(sourceId: string): Promise<NotificationInfoDto[]> {
    // Fetch the friend list using the user ID from the DTO
    return this.notificationRepository.getNotification(sourceId);
  }

  async createNotification({
    sourceUserId,
    targetUserId,
    type,
    meetingId,
  }: {
    sourceUserId: string;
    targetUserId: string;
    type: NotificationType;
    meetingId?: string;
  }): Promise<void> {
    const notification = this.notificationRepository.create({
      type,
      sourceUser: { id: sourceUserId },
      targetUser: { id: targetUserId },
      meetingId,
    });

    await this.notificationRepository.save(notification);

    this.sseService.sendToClient(targetUserId, notification);

    // FCM 토큰 조회
    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
      select: ['fcmToken'], // FCM 토큰만 가져오기
    });

    if (targetUser?.fcmToken) {
      // FCM 알림 제목과 본문 설정
      let title = '';
      let body = '';

      if (type === NotificationType.MEETING_ALARM) {
        title = '새로운 모닥불이 도착했습니다!';
        body = '새로운 모닥불을 확인해보세요!';
      } else if (type === NotificationType.FRIEND_REQUEST) {
        title = '새로운 친구요청이 도착했습니다!';
        body = '새로운 친구요청을 확인해보세요!';
      }

      // FCM 알림 전송
      await this.fcmService.sendPushNotification(targetUser.fcmToken, {
        title,
        body,
        data: {
          notificationId: notification.id,
          meetingId: meetingId || '',
        },
      });
    }
  }
}
