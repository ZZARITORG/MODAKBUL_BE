import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Group, GroupMember } from 'src/common/db/entities/group.entity';
import { CreateGroupReqDto } from '../group/dtos/create-group-req.dto';
import { USER_REPO, UserRepository } from './user.repository';
export const GROUP_REPO = 'GROUP_REPO';

@Injectable()
export class GroupRepository extends Repository<Group> {
  private readonly groupMemberRepository: Repository<GroupMember>;
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepository,
    private dataSource: DataSource,
  ) {
    super(Group, dataSource.createEntityManager());
    this.groupMemberRepository = dataSource.getRepository(GroupMember);
  }

  async saveGroup(createGroupReqDto: CreateGroupReqDto, userId: string) {
    //사용자 찾기
    const owner = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!owner) {
      throw new NotFoundException('요청을 보낸 사용자 정보가 없습니다.');
    }

    //그룹에 포함되는 친구리스트 찾기
    const members = await this.userRepo.findUsersByIds(createGroupReqDto.friendIds);

    if (members.length !== createGroupReqDto.friendIds.length) {
      throw new NotFoundException('특정 사용자 정보가 없습니다.');
    }

    //그룹생성
    const group = this.create({
      name: createGroupReqDto.groupName,
      owner: owner,
    });

    const savedGroup = await this.save(group);

    //그룹멤버생성
    const groupMembers = members.map((member) => {
      return this.groupMemberRepository.create({
        group: savedGroup,
        user: member,
      });
    });

    await this.groupMemberRepository.save(groupMembers);

    //생성된 그룹 조회해서 반환
    return await this.createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.members', 'groupMember')
      .leftJoinAndSelect('groupMember.user', 'user')
      .where('group.id = :id', { id: savedGroup.id })
      .getOne();
  }

  async findOneGroup(groupId: string) {
    return await this.createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'groupMember')
      .leftJoinAndSelect('groupMember.user', 'user')
      .where('group.id = :groupId', { groupId })
      .getOne();
  }

  async finAllGroup(targetId: string) {
    //사용자의 모든 그룹 조회
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'groupMember')
      .leftJoinAndSelect('groupMember.user', 'user')
      .select([
        'group.id',
        'group.createdAt',
        'group.name',
        'groupMember.id',
        'user.id',
        'user.userId',
        'user.name',
        'user.profileUrl',
      ])
      .where('group.owner = :targetId', { targetId })
      .orderBy('group.createdAt', 'DESC')
      .getMany();
  }

  async updateGroup(group: Group, updateGroupReqDto: CreateGroupReqDto) {
    //그룹명 업데이트
    if (updateGroupReqDto.groupName) {
      group.name = updateGroupReqDto.groupName;
    }
    const savedGroup = await this.save(group);

    //그룹멤버 업데이트
    if (updateGroupReqDto.friendIds.length > 0) {
      console.log('진입');
      //기존 그룹멤버 삭제
      await this.createQueryBuilder()
        .delete()
        .from(GroupMember)
        .where('group_id = :groupId', { groupId: group.id })
        .execute();

      const members = await this.userRepo.findUsersByIds(updateGroupReqDto.friendIds);
      if (members.length !== updateGroupReqDto.friendIds.length) {
        throw new NotFoundException('특정 사용자 정보가 없습니다.');
      }
      console.log('멤버', members);
      const groupMembers = members.map((member) => {
        return this.groupMemberRepository.create({
          group: group,
          user: member,
        });
      });

      console.log('그룹멤버', groupMembers);

      //그룹멤버 저장
      await this.groupMemberRepository.save(groupMembers);
    }

    return await this.createQueryBuilder('group')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.members', 'groupMember')
      .leftJoinAndSelect('groupMember.user', 'user')
      .where('group.id = :id', { id: savedGroup.id })
      .getOne();
  }

  async deleteOneGroup(groupId: string) {
    //특정 그룹 삭제
    return await this.createQueryBuilder('group').delete().from(Group).where('id = :groupId', { groupId }).execute();
  }
}
