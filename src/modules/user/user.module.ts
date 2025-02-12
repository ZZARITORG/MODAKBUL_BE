import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/common/db/entities/user.entity';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { FRIEND_REPO, FriendRepository } from '../repositories/friend.repository';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NotificationModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
    {
      provide: FRIEND_REPO,
      useClass: FriendRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
