import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { GetNotificationDto } from './dtos/notification-list-dto';
import { Notification } from 'src/common/db/entities/notification.entitiy';
import { NotificationInfoDto } from './dtos/notification-info-dto';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}
  async notificationList(getNotificationDto: GetNotificationDto, sourceId: string): Promise<NotificationInfoDto[]> {
    // Fetch the friend list using the user ID from the DTO
    return this.notificationRepository.getNotification(getNotificationDto, sourceId);
  }
}
