import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FriendShip, FriendStatus } from 'src/common/db/entities/friendship.entity';
import { DataSource, Repository } from 'typeorm';
import { FriendReqDto } from '../friend/dtos/friend-req-dto';
import { User } from 'src/common/db/entities/user.entity';
import { FriendBlockDto } from '../friend/dtos/friend-block-dto';
import { FriendAcptDto } from '../friend/dtos/friend-acpt-dto';
import { FriendInfoDto } from '../friend/dtos/friend-info-dto';

@Injectable()
export class FriendRepository extends Repository<FriendShip> {
  private readonly logger = new Logger(FriendRepository.name);
  constructor(private dataSource: DataSource) {
    super(FriendShip, dataSource.createEntityManager());
  }

  async addFriendship(friendReqDto: FriendReqDto): Promise<FriendShip | null> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { userId: friendReqDto.source_id } });
    const targetUser = await this.dataSource.getRepository(User).findOne({ where: { userId: friendReqDto.target_id } });

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
      return await this.save(friendship);
    }
  }
  async acptFriendship(friendAcptDto: FriendAcptDto): Promise<FriendShip | null> {
    const sourceUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { userId: friendAcptDto.source_id } });
    const targetUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { userId: friendAcptDto.target_id } });

    const friendship = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.PENDING);

    if (!friendship) {
      this.logger.log(`친구 요청이 존재하지 않거나 상태가 PENDING이 아닙니다.`);
      throw new NotFoundException('Friend request not found or not pending');
    }

    friendship.status = FriendStatus.ACCEPTED;
    this.logger.log(`친구 요청을 수락합니다: ${JSON.stringify(friendship)}`);
    return await this.save(friendship);
  }

  async blockFriendship(friendBlockDto: FriendBlockDto): Promise<FriendShip | null> {
    const sourceUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { userId: friendBlockDto.source_id } });
    const targetUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { userId: friendBlockDto.target_id } });
    const existingBlock = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.BLOCKED);

    if (existingBlock && existingBlock.status === FriendStatus.BLOCKED) {
      this.logger.log(`이미 차단된 사용자입니다.`);
      return; // 이미 차단된 경우 처리하지 않음
    }

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

  private async findFriendship(sourceId: string, targetId: string, status: FriendStatus): Promise<FriendShip | null> {
    return await this.findOne({
      where: [
        { source: { id: sourceId }, target: { id: targetId }, status: status },
        { source: { id: targetId }, target: { id: sourceId }, status: status },
      ],
    });
  }
  async getFriends(userId: string): Promise<FriendInfoDto[]> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { userId: userId } });
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
      const friend = friendship.source.id === sourceUser.id ? friendship.target : friendship.source;
      return {
        id: friend.id,
        userId: friend.userId,
        name: friend.name,
        profileUrl: friend.profileUrl,
      };
    });

    return friends; // 친구 정보 반환
  }

  async rejectFriendship(friendAcptDto: FriendAcptDto): Promise<void> {
    const sourceUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { userId: friendAcptDto.source_id } });
    const targetUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { userId: friendAcptDto.target_id } });
    // 친구 요청 찾기
    const friendship = await this.findFriendship(sourceUser.id, targetUser.id, FriendStatus.PENDING);

    if (!friendship) {
      this.logger.log(`친구 요청이 존재하지 않거나 상태가 PENDING이 아닙니다.`);
      throw new NotFoundException('Friend request not found or not pending');
    }

    await this.remove(friendship); // 삭제
    this.logger.log(`친구 요청을 삭제하였습니다: ${JSON.stringify(friendship)}`);
  }
}