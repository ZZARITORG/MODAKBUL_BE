import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendReqDto } from './dtos/friend-req-dto';
import { FriendAcptDto } from './dtos/friend-acpt-dto';
import { FriendBlockDto } from './dtos/friend-block-dto';
import { FriendRejectDto } from './dtos/friend-reject-dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FriendDeleteDto } from './dtos/friend-delete-dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('friend')
@ApiTags('FRIEND')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '친구 요청 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Post('friend-request')
  async friendReq(@Body() friendReqDto: FriendReqDto, @CurrentUser() sourceId: string) {
    return await this.friendService.friendReq(friendReqDto, sourceId);
  }

  @ApiOperation({ summary: '친구 수락 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Post('friend-accept')
  async acceptFriendReq(@Body() friendAcptDto: FriendAcptDto, @CurrentUser() sourceId: string) {
    return await this.friendService.friendAcpt(friendAcptDto, sourceId);
  }

  @ApiOperation({ summary: '친구 차단 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Post('friend-block')
  async blockFriend(@Body() friendBlockDto: FriendBlockDto, @CurrentUser() sourceId: string) {
    return await this.friendService.friendBlock(friendBlockDto, sourceId);
  }
  @ApiOperation({ summary: '친구 차단 해제 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Post('friend-unblock')
  async unblockFriend(@Body() friendBlockDto: FriendBlockDto, @CurrentUser() sourceId: string): Promise<void> {
    return await this.friendService.friendUnblock(friendBlockDto, sourceId);
  }
  @ApiOperation({ summary: '친구 거절 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Post('friend-reject')
  async rejectFriend(@Body() friendRejectDto: FriendRejectDto, @CurrentUser() sourceId: string) {
    return await this.friendService.friendReject(friendRejectDto, sourceId);
  }
  @ApiOperation({ summary: '알 수도 있는 친구 조회 API' })
  @ApiBearerAuth()
  @Get('suggested-friends')
  async getSuggestedFriends(@CurrentUser() sourceId: string) {
    return await this.friendService.friendList(sourceId);
  }
  @ApiOperation({ summary: '친구 리스트 조회 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Get('friend-list')
  async getFriends(@CurrentUser() sourceId: string) {
    return await this.friendService.friendList(sourceId);
  }
  @ApiOperation({ summary: '친구 요청 리스트 조회 API' })
  @ApiBearerAuth()
  @Get('friend-req-list')
  async getFriendReq(@CurrentUser() sourceId: string) {
    return await this.friendService.friendReqList(sourceId);
  }
  @ApiOperation({ summary: '친구 차단 리스트 조회 API' })
  @ApiBearerAuth()
  @Get('friend-block-list')
  async getFriendBlock(@CurrentUser() sourceId: string) {
    return await this.friendService.friendBlockList(sourceId);
  }
  @ApiOperation({ summary: '친구 삭제 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Delete()
  async removeFriendship(@Body() friendDeleteDto: FriendDeleteDto, @CurrentUser() sourceId: string): Promise<void> {
    await this.friendService.friendDelete(friendDeleteDto, sourceId);
  }
}
