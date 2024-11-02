import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { GROUP_REPO, GroupRepository } from '../repositories/group.repository';

@Injectable()
export class GroupService {
  constructor(@Inject(GROUP_REPO) private readonly groupRepo: GroupRepository) {}
  async createGroup(createGroupReqDto: CreateGroupReqDto, targetId: string) {
    return await this.groupRepo.saveGroup(createGroupReqDto, targetId);
  }

  async getAllGroup(targetId: string) {
    return await this.groupRepo.finAllGroup(targetId);
  }
  async deleteGroup(groupId: string) {
    return await this.groupRepo.deleteOneGroup(groupId);
  }
  async updateGroup(groupId: string, updateGroupDto: CreateGroupReqDto) {
    const group = await this.groupRepo.findOneGroup(groupId);

    if (!group) {
      throw new NotFoundException('그룹 정보가 없습니다.');
    }

    return await this.groupRepo.updateGroup(group, updateGroupDto);
  }
}
