import { Injectable } from '@nestjs/common';
import { FriendReqDto } from './dtos/friend-req-dto';
import { FriendRepository } from '../repositories/friend.repository';
import { FriendShip } from 'src/common/db/entities/friendship.entity';
import { FriendAcptDto } from './dtos/friend-acpt-dto';
import { FriendBlockDto } from './dtos/friend-block-dto';
import { FriendRejectDto } from './dtos/friend-reject-dto';
import { GetFriendsDto } from './dtos/friend-list-dto';
import { FriendInfoDto } from './dtos/friend-info-dto';
import { FriendDeleteDto } from './dtos/friend-delete-dto';

@Injectable()
export class FriendService {
  constructor(private readonly friendRepository: FriendRepository) {}
  async friendReq(friendReqDto: FriendReqDto, sourceId: string): Promise<FriendShip> {
    return this.friendRepository.addFriendship(friendReqDto, sourceId);
  }
  async friendAcpt(friendAcptDto: FriendAcptDto): Promise<FriendShip> {
    return this.friendRepository.acptFriendship(friendAcptDto);
  }
  async friendBlock(friendBlockDto: FriendBlockDto): Promise<FriendShip> {
    return this.friendRepository.blockFriendship(friendBlockDto);
  }
  async friendReject(friendRejectDto: FriendRejectDto): Promise<void> {
    return this.friendRepository.rejectFriendship(friendRejectDto);
  }
  async friendList(getFriendsDto: GetFriendsDto): Promise<FriendInfoDto[]> {
    // Fetch the friend list using the user ID from the DTO
    return this.friendRepository.getFriends(getFriendsDto.userId);
  }
  async friendDelete(friendDeleteDto: FriendDeleteDto): Promise<void> {
    return this.friendRepository.removeFriendship(friendDeleteDto); // DTO 전달
  }
}
