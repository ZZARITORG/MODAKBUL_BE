import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GROUP_REPO, GroupRepository } from '../repositories/group.repository';
import { USER_REPO, UserRepository } from '../repositories/user.repository';

@Module({
  controllers: [GroupController],
  providers: [
    GroupService,
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
    {
      provide: GROUP_REPO,
      useClass: GroupRepository,
    },
  ],
})
export class GroupModule {}
