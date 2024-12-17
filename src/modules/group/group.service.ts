import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { GROUP_REPO, GroupRepository } from '../repositories/group.repository';
import { UpdateResultResDto } from '../user/dtos/update-result-res-dto';
import { plainToInstance } from 'class-transformer';
import { GetGroupListResDto } from './dtos/get-group-list-res-dto';
import { CreateGroupResDto } from './dtos/create-group-res.dto';

@Injectable()
export class GroupService {
  constructor(@Inject(GROUP_REPO) private readonly groupRepo: GroupRepository) {}
  async createGroup(createGroupReqDto: CreateGroupReqDto, targetId: string): Promise<CreateGroupResDto> {
    const group = await this.groupRepo.saveGroup(createGroupReqDto, targetId);

    return {
      id: group.id,
      name: group.name,
      owner: {
        id: group.owner.id,
        userId: group.owner.userId,
        name: group.owner.name,
        phoneNo: group.owner.phoneNo,
        profileUrl: group.owner.profileUrl,
        fcmToken: group.owner.fcmToken,
      },
      members: group.members.map((member) => {
        return {
          id: member.id,
          user: {
            id: member.user.id,
            userId: member.user.userId,
            name: member.user.name,
            phoneNo: member.user.phoneNo,
            profileUrl: member.user.profileUrl,
            fcmToken: member.user.fcmToken,
          },
        };
      }),
    };
  }

  async getAllGroup(targetId: string): Promise<GetGroupListResDto[]> {
    const groups = await this.groupRepo.finAllGroup(targetId);
    const result = groups.map((group) => {
      return {
        id: group.id,
        name: group.name,
        members: group.members.map((member) => {
          return {
            id: member.id,
            user: {
              id: member.user.id,
              userId: member.user.userId,
              name: member.user.name,
              profileUrl: member.user.profileUrl,
            },
          };
        }),
        count: group.count,
        updatedAt: group.updatedAt,
      };
    });

    return result;
  }

  async deleteGroup(groupId: string): Promise<UpdateResultResDto> {
    const result = await this.groupRepo.deleteOneGroup(groupId);
    return plainToInstance(UpdateResultResDto, result);
  }

  async updateGroup(groupId: string, updateGroupDto: CreateGroupReqDto): Promise<UpdateResultResDto> {
    const group = await this.groupRepo.findOneGroup(groupId);

    if (!group) {
      throw new NotFoundException('그룹 정보가 없습니다.');
    }

    const result = await this.groupRepo.updateGroup(group, updateGroupDto);

    return plainToInstance(UpdateResultResDto, result);
  }
}
