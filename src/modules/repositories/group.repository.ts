import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Group } from 'src/common/db/entities/group.entity';
import { CreateGroupReqDto } from '../group/dtos/create-group-req.dto';
import { USER_REPO, UserRepository } from './user.repository';
export const GROUP_REPO = 'GROUP_REPO';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepository,
    private dataSource: DataSource,
  ) {
    super(Group, dataSource.createEntityManager());
  }

  async saveGroup(createGroupReqDto: CreateGroupReqDto, userId: string) {
    const owner = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!owner) {
      throw new NotFoundException('요청을 보낸 사용자 정보가 없습니다.');
    }

    console.log(owner);

    // 2. 멤버 조회
    const members = await this.userRepo.findUsersByIds(createGroupReqDto.friendIds);

    console.log(members);

    // 3. 그룹 생성
    const group = this.create({
      name: createGroupReqDto.groupName,
      owner: owner,
      members: members,
    });

    // 4. 저장
    const savedGroup = await this.save(group);

    // 5. 관계 데이터와 함께 조회하여 반환
    return await this.findOne({
      where: { id: savedGroup.id },
      relations: ['owner', 'members'],
    });
  }
}
