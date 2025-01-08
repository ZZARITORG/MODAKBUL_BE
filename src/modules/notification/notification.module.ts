import { Module } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SseService } from './sse.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationRepository, NotificationService, SseService],
  exports: [NotificationRepository, SseService],
})
export class NotificationModule {}
