import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationInfoDto } from './dtos/notification-info-dto';
import { GetNotificationDto } from './dtos/notification-list-dto';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}
  async notificationList(getNotificationDto: GetNotificationDto, sourceId: string): Promise<NotificationInfoDto[]> {
    // Fetch the friend list using the user ID from the DTO
    return this.notificationRepository.getNotification(getNotificationDto, sourceId);
  }
}
