import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { FriendRepository } from '../repositories/friend.repository';

@Module({
  providers: [FriendService, FriendRepository],
  controllers: [FriendController],
})
export class FriendModule {}
