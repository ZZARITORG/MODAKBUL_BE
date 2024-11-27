import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/common/db/entities/user.entity';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { FRIEND_REPO, FriendRepository } from '../repositories/friend.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
})
export class UserModule {}
