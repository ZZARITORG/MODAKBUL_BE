import { Body, Controller, Get } from '@nestjs/common';
import { GetNotificationDto } from './dtos/notification-list-dto';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: '알람 리스트 조회 API' })
  @ApiResponse({})
  @Get('notification-list')
  async getFriends(@Body() getNotificationDto: GetNotificationDto, @CurrentUser() sourceId: string) {
    return await this.notificationService.notificationList(getNotificationDto, sourceId);
  }
}
