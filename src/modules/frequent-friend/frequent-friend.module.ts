import { Module } from '@nestjs/common';
import { FrequentFriendController } from './frequent-friend.controller';
import { FrequentFriendService } from './frequent-friend.service';
@Module({
  providers: [FrequentFriendService],
  controllers: [FrequentFriendController],
})
export class FrequentFriendModule {}
