import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequentFriendService } from './frequent-friend.service';
import { FrequentFriendController } from './frequent-friend.controller';
@Module({
  providers: [FrequentFriendService],
  controllers: [FrequentFriendController],
})
export class FrequentFriendModule {}
