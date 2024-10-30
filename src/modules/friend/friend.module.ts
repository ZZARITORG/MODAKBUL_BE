import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { USER_REPO, UserRepository } from '../repositories/user.repository';

@Module({
  providers: [
    FriendService,
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
  ],
  controllers: [FriendController],
})
export class FriendModule {}
