import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { MEETING_REPO, MeetingRepository } from '../repositories/meeting.repository';
import { GROUP_REPO, GroupRepository } from '../repositories/group.repository';
import { FRIEND_REPO, FriendRepository } from '../repositories/friend.repository';
import { NotificationService } from '../notification/notification.service';
import { NOTIFICATION_REPO, NotificationRepository } from '../repositories/notification.repository';
import { NotificationModule } from '../notification/notification.module';
import { FcmService } from '../notification/fcm.service';

@Module({
  imports: [NotificationModule],
  controllers: [MeetingController],
  providers: [
    MeetingService,
    NotificationService,
    UserRepository,
    FcmService,
    {
      provide: NOTIFICATION_REPO,
      useClass: NotificationRepository,
    },
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
    {
      provide: MEETING_REPO,
      useClass: MeetingRepository,
    },
    {
      provide: GROUP_REPO,
      useClass: GroupRepository,
    },
    {
      provide: FRIEND_REPO,
      useClass: FriendRepository,
    },
  ],
})
export class MeetingModule {}
