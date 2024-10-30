import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { USER_REPO, UserRepository } from '../repositories/user.repository';

@Module({
  controllers: [MeetingController],
  providers: [
    MeetingService,
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
  ],
})
export class MeetingModule {}
