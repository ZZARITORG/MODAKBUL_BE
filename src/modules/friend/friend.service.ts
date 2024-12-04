import { Injectable } from '@nestjs/common';
import { FriendReqDto } from './dtos/friend-req-dto';
import { FriendRepository } from '../repositories/friend.repository';
import { FriendShip } from 'src/common/db/entities/friendship.entity';
import { FriendAcptDto } from './dtos/friend-acpt-dto';
import { FriendBlockDto } from './dtos/friend-block-dto';
import { FriendRejectDto } from './dtos/friend-reject-dto';
import { FriendInfoDto } from './dtos/friend-info-dto';
import { FriendDeleteDto } from './dtos/friend-delete-dto';
import { FriendListDto } from './dtos/friend-list-dto';

@Injectable()
export class FriendService {
  constructor(private readonly friendRepository: FriendRepository) {}
  async friendReq(friendReqDto: FriendReqDto, sourceId: string): Promise<FriendShip> {
    return this.friendRepository.addFriendship(friendReqDto, sourceId);
  }
  async friendAcpt(friendAcptDto: FriendAcptDto, sourceId: string): Promise<FriendShip> {
    return this.friendRepository.acptFriendship(friendAcptDto, sourceId);
  }
  async friendBlock(friendBlockDto: FriendBlockDto, sourceId: string): Promise<FriendShip> {
    return this.friendRepository.blockFriendship(friendBlockDto, sourceId);
  }
  async friendReject(friendRejectDto: FriendRejectDto, sourceId: string): Promise<void> {
    return this.friendRepository.rejectFriendship(friendRejectDto, sourceId);
  }
  async friendList(sourceId: string): Promise<FriendListDto[]> {
    // Fetch the friend list using the user ID from the DTO
    return this.friendRepository.getFriends(sourceId);
  }
  async friendDelete(friendDeleteDto: FriendDeleteDto, sourceId: string): Promise<void> {
    return this.friendRepository.removeFriendship(friendDeleteDto, sourceId); // DTO 전달
  }
  async friendReqList(sourceId: string): Promise<FriendInfoDto[]> {
    return this.friendRepository.getFriendReq(sourceId);
  }
  async friendBlockList(sourceId: string): Promise<FriendInfoDto[]> {
    return this.friendRepository.getFriendBlock(sourceId);
  }
}
