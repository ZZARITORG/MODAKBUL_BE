import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { GROUP_REPO, GroupRepository } from '../repositories/group.repository';

@Injectable()
export class GroupService {
  constructor(@Inject(GROUP_REPO) private readonly groupRepo: GroupRepository) {}
  async createGroup(createGroupReqDto: CreateGroupReqDto, userId: string) {
    return await this.groupRepo.saveGroup(createGroupReqDto, userId);
  }
}
