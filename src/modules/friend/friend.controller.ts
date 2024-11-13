import { Body, Controller, Delete, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendReqDto } from './dtos/friend-req-dto';
import { FriendAcptDto } from './dtos/friend-acpt-dto';
import { FriendBlockDto } from './dtos/friend-block-dto';
import { FriendRejectDto } from './dtos/friend-reject-dto';
import { GetFriendsDto } from './dtos/friend-list-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FriendDeleteDto } from './dtos/friend-delete-dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '친구 요청 API' })
  @ApiResponse({})
  @Post('friend-request')
  async friendReq(@Body() friendReqDto: FriendReqDto, @CurrentUser() sourceId: string) {
    return await this.friendService.friendReq(friendReqDto, sourceId);
  }

  @ApiOperation({ summary: '친구 수락 API' })
  @ApiResponse({})
  @Post('friend-accept')
  async acceptFriendReq(@Body() friendAcptDto: FriendAcptDto) {
    return await this.friendService.friendAcpt(friendAcptDto);
  }

  @ApiOperation({ summary: '친구 차단 API' })
  @ApiResponse({})
  @Post('friend-block')
  async blockFriend(@Body() friendBlockDto: FriendBlockDto) {
    return await this.friendService.friendBlock(friendBlockDto);
  }

  @ApiOperation({ summary: '친구 거절 API' })
  @ApiResponse({})
  @Post('friend-reject')
  async rejectFriend(@Body() friendRejectDto: FriendRejectDto) {
    return await this.friendService.friendReject(friendRejectDto);
  }

  @ApiOperation({ summary: '친구 리스트 조회 API' })
  @ApiResponse({})
  @Post('friend-list')
  async getFriends(@Body() getFriendsDto: GetFriendsDto) {
    return await this.friendService.friendList(getFriendsDto);
  }

  @ApiOperation({ summary: '친구 삭제 API' })
  @ApiResponse({})
  @Delete()
  async removeFriendship(@Body() friendDeleteDto: FriendDeleteDto): Promise<void> {
    await this.friendService.friendDelete(friendDeleteDto);
  }
}
