import { Body, Controller, Get } from '@nestjs/common';
import { GetNotificationDto } from './dtos/notification-list-dto';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get('notification-list')
  async getFriends(@Body() getNotificationDto: GetNotificationDto, @CurrentUser() sourceId: string) {
    return await this.notificationService.notificationList(getNotificationDto, sourceId);
  }
}
