import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { MEETING_REPO, MeetingRepository } from '../repositories/meeting.repository';

@Module({
  controllers: [MeetingController],
  providers: [
    MeetingService,
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
    {
      provide: MEETING_REPO,
      useClass: MeetingRepository,
    },
  ],
})
export class MeetingModule {}
