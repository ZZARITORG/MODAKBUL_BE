import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { FriendRepository } from '../repositories/friend.repository';
import { NotificationModule } from '../notification/notification.module';
import { NOTIFICATION_REPO, NotificationRepository } from '../repositories/notification.repository';

@Module({
  imports: [NotificationModule],
  providers: [
    FriendService,
    FriendRepository,
    {
      provide: NOTIFICATION_REPO,
      useClass: NotificationRepository,
    },
  ],
  controllers: [FriendController],
})
export class FriendModule {}
