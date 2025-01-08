import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationInfoDto } from './dtos/notification-info-dto';
import { NotificationType } from 'src/common/db/entities/notification.entitiy';
import { SseService } from './sse.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sseService: SseService,
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

    this.sseService.sendToClient(targetUserId, type);
  }
}
