import { Body, Controller, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendReqDto } from './dtos/friend-req-dto';
import { FriendAcptDto } from './dtos/friend-acpt-dto';
import { FriendBlockDto } from './dtos/friend-block-dto';
import { FriendRejectDto } from './dtos/friend-reject-dto';
import { GetFriendsDto } from './dtos/friend-list-dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('friend-request')
  async friendReq(@Body() friendReqDto: FriendReqDto) {
    return await this.friendService.friendReq(friendReqDto);
  }
  @Post('friend-accept')
  async acceptFriendReq(@Body() friendAcptDto: FriendAcptDto) {
    return await this.friendService.friendAcpt(friendAcptDto);
  }
  @Post('friend-block')
  async blockFriend(@Body() friendBlockDto: FriendBlockDto) {
    return await this.friendService.friendBlock(friendBlockDto);
  }
  @Post('friend-reject')
  async rejectFriend(@Body() friendRejectDto: FriendRejectDto) {
    return await this.friendService.friendReject(friendRejectDto);
  }
  @Post('friend-list')
  async getFriends(@Body() getFriendsDto: GetFriendsDto) {
    return await this.friendService.friendList(getFriendsDto);
  }
}
