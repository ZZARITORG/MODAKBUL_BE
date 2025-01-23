import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FriendShip, FriendStatus } from 'src/common/db/entities/friendship.entity';
import { DataSource, In, Repository } from 'typeorm';
import { FriendReqDto } from '../friend/dtos/friend-req-dto';
import { User } from 'src/common/db/entities/user.entity';
import { FriendBlockDto } from '../friend/dtos/friend-block-dto';
import { FriendAcptDto } from '../friend/dtos/friend-acpt-dto';
import { FriendInfoDto } from '../friend/dtos/friend-info-dto';
import { FriendDeleteDto } from '../friend/dtos/friend-delete-dto';
import { Notification, NotificationType } from 'src/common/db/entities/notification.entitiy';
import { FriendRejectDto } from '../friend/dtos/friend-reject-dto';
import { FriendListDto } from '../friend/dtos/friend-list-dto';
import { Group } from 'src/common/db/entities/group.entity';
import { FriendSuggestionDto } from '../friend/dtos/firend-suggest-dto';
export const FRIEND_REPO = 'FRIEND_REPO';

@Injectable()
export class FriendRepository extends Repository<FriendShip> {
  private readonly logger = new Logger(FriendRepository.name);
  constructor(private dataSource: DataSource) {
    super(FriendShip, dataSource.createEntityManager());
  }
  private async createNotification(
    sourceUserId: string,
    targetUserId: string,
    type: NotificationType,
    meetingId?: string,
  ): Promise<void> {
    const notificationRepository = this.dataSource.getRepository(Notification); // Notification 레포지토리 가져오기
    const notification = notificationRepository.create({
      type: type, // 알림 타입 설정
      sourceUser: { id: sourceUserId }, // 친구 요청을 보낸 사람의 UUID
      targetUser: { id: targetUserId }, // 요청을 받은 사람의 UUID
      meetingId, // 약속 UUID (옵션)
    });

    await notificationRepository.save(notification); // 알림 저장
    this.logger.log(`알림이 생성되었습니다: ${JSON.stringify(notification)}`); // 로그에 알림 정보 기록
  }

  async addFriendship(friendReqDto: FriendReqDto, sourceId: string): Promise<FriendShip | null> {
    this.logger.log(`우오오오오ㅗㅇ오: ${JSON.stringify(sourceId)}`);
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendReqDto.target_id } });

    this.logger.log(`Source User: ${JSON.stringify(sourceUser.id)}`);
    this.logger.log(`Target User: ${JSON.stringify(targetUser.id)}`);

    if (!sourceUser || !targetUser) {
      throw new NotFoundException('Source or Target User not found');
    }
    //이미 친구인지 확인
    const existingFriendship = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.ACCEPTED);

    if (existingFriendship) {
      this.logger.log(`이미 친구인 상태입니다. 친구 요청을 무시합니다.`);
      return null; // 이미 친구이므로 요청을 무시
    }
    // 이미 보낸 친구 요청이 있는지 확인
    const existingRequest = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.PENDING);

    if (existingRequest) {
      this.logger.log(`이미 친구 요청이 존재합니다. 추가하지 않습니다.`);
      return null; // 중복 요청이므로 추가하지 않음
    }

    // 서로 친구 요청을 보냈는지 확인
    const reciprocalRequest = await this.findFriendship(targetUser.id, sourceUser.id, FriendStatus.PENDING);

    if (reciprocalRequest) {
      this.logger.log(`서로 친구 요청이 존재하므로 상태를 ACCEPTED로 변경합니다.`);
      reciprocalRequest.status = FriendStatus.ACCEPTED;
      return await this.save(reciprocalRequest);
    } else {
      // 새로운 친구 요청 생성
      const friendship = this.create({
        source: sourceUser,
        target: targetUser,
        status: FriendStatus.PENDING, // 최초 상태로 PENDING 설정
      });
      this.logger.log(`새로운 친구 요청을 생성합니다: ${JSON.stringify(friendship)}`);
      await this.createNotification(sourceUser.id, targetUser.id, NotificationType.FRIEND_REQUEST); // 알림 생성
      return await this.save(friendship);
    }
  }
  async getSuggestedFriends(userId: string, contactList: string[]): Promise<FriendSuggestionDto[]> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });

    if (!sourceUser) {
      throw new NotFoundException('Source User not found');
    }

    // 사용자가 아는 친구 목록 조회
    const friendships = await this.find({
      where: [
        { source: { id: sourceUser.id }, status: FriendStatus.ACCEPTED },
        { target: { id: sourceUser.id }, status: FriendStatus.ACCEPTED },
      ],
      relations: ['source', 'target'],
    });

    // 친구 목록에서 각각의 친구의 친구 목록을 찾기
    const suggestedFriends: FriendSuggestionDto[] = [];

    for (const friendship of friendships) {
      const friend = friendship.source.id === sourceUser.id ? friendship.target : friendship.source;

      // 친구의 친구 목록 조회
      const friendFriends = await this.find({
        where: [
          { source: { id: friend.id }, status: FriendStatus.ACCEPTED },
          { target: { id: friend.id }, status: FriendStatus.ACCEPTED },
        ],
        relations: ['source', 'target'],
      });

      for (const friendFriendship of friendFriends) {
        const friendOfFriend =
          friendFriendship.source.id === friend.id ? friendFriendship.target : friendFriendship.source;

        // 이미 친구인 경우는 제외
        if (friendOfFriend.id === sourceUser.id || suggestedFriends.some((s) => s.id === friendOfFriend.id)) {
          continue;
        }

        // 함께 아는 친구 수 계산
        const mutualFriendCount = await this.getMutualFriendCount(sourceUser.id, friendOfFriend.id);

        suggestedFriends.push({
          id: friendOfFriend.id,
          userId: friendOfFriend.userId,
          name: friendOfFriend.name,
          profileUrl: friendOfFriend.profileUrl,
          mutualFriendCount,
        });
        if (contactList && contactList.length > 0) {
          const contacts = await this.dataSource.getRepository(User).find({
            where: {
              phoneNo: In(contactList), // 연락처 배열에 포함된 사용자 검색
            },
          });
          for (const contact of contacts) {
            // 이미 추천된 사용자나 현재 사용자인 경우 제외
            if (contact.id === sourceUser.id || suggestedFriends.some((s) => s.id === contact.id)) {
              continue;
            }
            // 함께 아는 친구 수 계산
            const mutualFriendCount = await this.getMutualFriendCount(sourceUser.id, contact.id);
            suggestedFriends.push({
              id: contact.id,
              userId: contact.userId,
              name: contact.name,
              profileUrl: contact.profileUrl,
              mutualFriendCount, // 연락처 기반 추천이므로 기본 값으로 설정
            });
          }
        }
      }
    }

    return suggestedFriends;
  }

  // 친구의 친구 목록에서 함께 아는 친구 수를 계산하는 함수
  async getMutualFriendCount(userId1: string, userId2: string): Promise<number> {
    const friendshipsUser1 = await this.find({
      where: [
        { source: { id: userId1 }, status: FriendStatus.ACCEPTED },
        { target: { id: userId1 }, status: FriendStatus.ACCEPTED },
      ],
      relations: ['source', 'target'],
    });

    const friendshipsUser2 = await this.find({
      where: [
        { source: { id: userId2 }, status: FriendStatus.ACCEPTED },
        { target: { id: userId2 }, status: FriendStatus.ACCEPTED },
      ],
      relations: ['source', 'target'],
    });

    // userId1과 userId2가 공유하는 친구 수를 계산
    const friendsUser1 = friendshipsUser1.map((friendship) =>
      friendship.source.id === userId1 ? friendship.target.id : friendship.source.id,
    );
    const friendsUser2 = friendshipsUser2.map((friendship) =>
      friendship.source.id === userId2 ? friendship.target.id : friendship.source.id,
    );

    // 두 친구 목록의 교집합 계산
    const mutualFriends = friendsUser1.filter((friendId) => friendsUser2.includes(friendId));

    return mutualFriends.length;
  }

  async acptFriendship(friendAcptDto: FriendAcptDto, sourceId: string): Promise<FriendShip | null> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendAcptDto.target_id } });

    const friendship = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.PENDING);

    if (!friendship) {
      this.logger.log(`친구 요청이 존재하지 않거나 상태가 PENDING이 아닙니다.`);
      throw new NotFoundException('Friend request not found or not pending');
    }

    friendship.status = FriendStatus.ACCEPTED;
    this.logger.log(`친구 요청을 수락합니다: ${JSON.stringify(friendship)}`);
    return await this.save(friendship);
  }

  async blockFriendship(friendBlockDto: FriendBlockDto, sourceId: string): Promise<FriendShip | null> {
    //const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendBlockDto.source_id } });
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendBlockDto.target_id } });
    const existingBlock = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.BLOCKED);

    const existingFriendship = await this.createQueryBuilder('friendship')
      .where(
        `(friendship.source_id = :sourceId AND friendship.target_id = :targetId)
       OR (friendship.source_id = :targetId AND friendship.target_id = :sourceId)`,
        { sourceId: sourceUser.id, targetId: targetUser.id },
      )
      .getOne();

    if (existingFriendship) {
      await this.remove(existingFriendship); // 기존 친구 관계 삭제
      this.logger.log(`기존 친구 관계를 삭제했습니다: ${existingFriendship.id}`);
    }
    if (existingBlock && existingBlock.status === FriendStatus.BLOCKED) {
      this.logger.log(`이미 차단된 사용자입니다.`);
      return; // 이미 차단된 경우 처리하지 않음
    }

    // existingBlock.blockedUser = sourceId;
    // existingBlock.status = FriendStatus.BLOCKED;
    // return await this.save(existingBlock);

    // 차단 기록 생성
    const blockRecord = this.create({
      source: sourceUser,
      target: targetUser,
      status: FriendStatus.BLOCKED, // 상태를 BLOCKED로 설정
    });

    await this.save(blockRecord);
    this.logger.log(`사용자를 차단하였습니다: ${friendBlockDto.target_id}`);
    return blockRecord; // 차단된 기록 반환
  }

  async unblockFriendship(friendBlockDto: FriendBlockDto, sourceId: string): Promise<void> {
    // 차단 해제할 사용자 정보 가져오기
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendBlockDto.target_id } });

    if (!sourceUser || !targetUser) {
      throw new NotFoundException('Source or Target User not found');
    }

    // BLOCKED 상태의 친구 관계 찾기
    const blockedFriendship = await this.findOne({
      where: {
        source: { id: sourceUser.id },
        target: { id: targetUser.id },
        status: FriendStatus.BLOCKED,
      },
      relations: ['source', 'target'],
    });

    if (!blockedFriendship) {
      this.logger.log(`차단된 친구 관계가 존재하지 않습니다.`);
      throw new NotFoundException('Blocked friendship not found');
    }

    // 차단 관계 삭제
    await this.remove(blockedFriendship);
    this.logger.log(`사용자의 차단을 해제했습니다: ${targetUser.id}`);
  }

  async findFriendship(sourceId: string, targetId: string, status: FriendStatus): Promise<FriendShip | null> {
    return await this.findOne({
      where: [
        { source: { id: sourceId }, target: { id: targetId }, status: status },
        { source: { id: targetId }, target: { id: sourceId }, status: status },
      ],
      relations: ['source', 'target'],
    });
  }

  async findFriendshipByIds(sourceId: string, targetId: string): Promise<FriendShip | null> {
    return await this.findOne({
      where: [
        { source: { id: sourceId }, target: { id: targetId } },
        { source: { id: targetId }, target: { id: sourceId } },
      ],
      relations: ['source', 'target'],
    });
  }

  async findBlocked(sourceId: string, targetId: string, status: FriendStatus): Promise<FriendShip | null> {
    return await this.findOne({
      where: [{ source: { id: sourceId }, target: { id: targetId }, status: status }],
      relations: ['source', 'target'],
    });
  }

  // 친구 삭제 메소드
  async removeFriendship(friendDeleteDto: FriendDeleteDto, sourceId: string): Promise<void> {
    //const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendDeleteDto.source_id } });
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendDeleteDto.target_id } });

    const friendship = await this.findFriendshipByIds(sourceUser.id, targetUser.id);

    if (!friendship) {
      this.logger.log(`친구 관계가 존재하지 않습니다.`);
      throw new NotFoundException('Friendship not found');
    }

    await this.remove(friendship); // 친구 관계 삭제
    this.logger.log(`친구 관계가 삭제되었습니다: ${JSON.stringify(friendship)}`);
  }
  async getFriends(sourceId: string): Promise<FriendListDto[]> {
    //const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { userId: userId } });
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    // 친구 목록을 조회하는 로직
    const friendships = await this.find({
      where: [
        { source: { id: sourceUser.id }, status: FriendStatus.ACCEPTED },
        { target: { id: sourceUser.id }, status: FriendStatus.ACCEPTED },
      ],
      relations: ['source', 'target'], // source와 target 관계를 가져오기
    });

    // 친구 정보 리스트 생성
    const friends = friendships.map((friendship) => {
      const isSource = friendship.source.id === sourceUser.id;
      const friend = friendship.source.id === sourceUser.id ? friendship.target : friendship.source;
      return {
        id: friend.id,
        userId: friend.userId,
        name: friend.name,
        profileUrl: friend.profileUrl,
        count: isSource ? friendship.sourcecount : friendship.targetcount,
        updatedAt: friendship.updatedAt,
      };
    });

    friends.sort((a, b) => a.name.localeCompare(b.name));

    return friends; // 친구 정보 반환
  }
  async getFriendReq(userId: string): Promise<FriendInfoDto[]> {
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });
    this.logger.log(`이것이유저아이디: ${userId}`);
    if (!targetUser) {
      throw new NotFoundException('Target User not found');
    }
    // 친구 목록을 조회하는 로직
    const friendships = await this.find({
      where: { target: { id: targetUser.id }, status: FriendStatus.PENDING },

      relations: ['source'], //source만 가져오기
    });

    // 친구 정보 리스트 생성
    const friends = friendships.map((friendship) => {
      return {
        id: friendship.source.id,
        userId: friendship.source.userId,
        name: friendship.source.name,
        profileUrl: friendship.source.profileUrl,
        createdAt: friendship.source.createdAt,
        updatedAt: friendship.source.updatedAt,
      };
    });

    return friends; // 친구 정보 반환
  }
  async getFriendBlock(userId: string): Promise<FriendInfoDto[]> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });
    this.logger.log(`이것이유저아이디: ${userId}`);
    if (!sourceUser) {
      throw new NotFoundException('Target User not found');
    }
    // 친구 목록을 조회하는 로직
    const friendships = await this.find({
      where: { source: { id: sourceUser.id }, status: FriendStatus.BLOCKED },

      relations: ['target'], //target만 가져오기
    });

    // 친구 정보 리스트 생성
    const friends = friendships.map((friendship) => {
      return {
        id: friendship.target.id,
        userId: friendship.target.userId,
        name: friendship.target.name,
        profileUrl: friendship.target.profileUrl,
        createdAt: friendship.target.createdAt,
        updatedAt: friendship.target.updatedAt,
      };
    });

    return friends; // 친구 정보 반환
  }

  async rejectFriendship(friendRejectDto: FriendRejectDto, sourceId: string): Promise<void> {
    // const sourceUser = await this.dataSource
    //   .getRepository(User)
    //   .findOne({ where: { userId: friendAcptDto.source_id } });
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: sourceId } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { id: friendRejectDto.target_id } });
    // 친구 요청 찾기
    const friendship = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.PENDING);

    if (!friendship) {
      this.logger.log(`친구 요청이 존재하지 않거나 상태가 PENDING이 아닙니다.`);
      throw new NotFoundException('Friend request not found or not pending');
    }

    // 상태를 'REJECTED'로 변경
    friendship.status = FriendStatus.REJECTED;

    this.logger.log(`친구 요청을 거절하였습니다: ${JSON.stringify(friendship)}`);

    // 변경된 상태 저장
    await this.save(friendship);
  }

  async countUp(hostId: string, group: Group) {
    // FrequentFriend 생성 또는 업데이트

    for (const member of group.members) {
      const user = member.user;

      const friendShip = await this.findOne({
        where: [
          { source: { id: hostId }, target: { id: user.id } },
          { source: { id: user.id }, target: { id: hostId } },
        ],
        relations: ['source', 'target'],
      });

      if (friendShip) {
        if (friendShip.source) {
          // userId가 source인 경우 sourcecount 증가
          if (friendShip.source.id === hostId) {
            friendShip.sourcecount += 1;
          }
          // userId가 target인 경우 targetcount 증가
          else if (friendShip.target.id === hostId) {
            friendShip.targetcount += 1;
          }
          await this.save(friendShip); // FriendShip 엔티티 저장
        }
      } else {
        throw new BadRequestException('그룹멤버중에 친구가 아닌 사용자가 존재합니다.');
      }
    }
  }
  async countUpByIds(hostId: string, friendIds: string[]) {
    // FrequentFriend 생성 또는 업데이트

    for (const friendId of friendIds) {
      const friendShip = await this.findOne({
        where: [
          { source: { id: hostId }, target: { id: friendId } },
          { source: { id: friendId }, target: { id: hostId } },
        ],
        relations: ['source', 'target'],
      });

      if (friendShip) {
        if (friendShip.source) {
          // userId가 source인 경우 sourcecount 증가
          if (friendShip.source.id === hostId) {
            friendShip.sourcecount += 1;
          }
          // userId가 target인 경우 targetcount 증가
          else if (friendShip.target.id === hostId) {
            friendShip.targetcount += 1;
          }
          await this.save(friendShip); // FriendShip 엔티티 저장
        }
      } else {
        throw new BadRequestException('그룹멤버중에 친구가 아닌 사용자가 존재합니다.');
      }
    }
  }
}
