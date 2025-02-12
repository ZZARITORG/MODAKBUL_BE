import { Module } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SseService } from './sse.service';
import { UserRepository } from '../repositories/user.repository';
import { FcmService } from './fcm.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationRepository, NotificationService, SseService, UserRepository, FcmService],
  exports: [NotificationService, NotificationRepository, SseService],
})
export class NotificationModule {}
