import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserIdReqDto } from 'src/common/dto/user-id-req-dto';
import { GetOtherResDto } from './dtos/get-other-res-dto';
import { GetUserResDto } from './dtos/get-user-res-dto';
import { UserSearchDto } from './dtos/search-user-dto';
import { UserSearchResDto } from './dtos/search-user-res-dto';
import { UidReqDto } from './dtos/uid-req-dto';
import { UpdateFcmReqDto } from './dtos/update-fcm-req-dto';
import { UpdateResultResDto } from './dtos/update-result-res-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('USER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 검색 API' })
  @ApiBearerAuth()
  @Get()
  async searchUsers(@CurrentUser() id: string, @Query() query: UserSearchDto): Promise<UserSearchResDto> {
    return this.userService.searchUsers(id, query);
  }

  @ApiOperation({ summary: '본인 정보 조회 API' })
  @ApiBearerAuth()
  @Get('me')
  async getUsers(@CurrentUser() userId: string): Promise<GetUserResDto> {
    return this.userService.getUsers(userId);
  }

  @ApiOperation({ summary: '유저 정보 조회 API' })
  @ApiResponse({ type: GetOtherResDto })
  @ApiBearerAuth()
  @Get(':id')
  async getUser(@CurrentUser() id: string, @Param() param: UserIdReqDto) {
    return this.userService.getUser(id, param.id);
  }

  @ApiOperation({ summary: '유저 정보 수정 API' })
  @ApiBearerAuth()
  @Patch()
  async updateUser(@CurrentUser() userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResultResDto> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'FCM토큰 추가 API' })
  @ApiBearerAuth()
  @Patch('fcm')
  async updateFcm(@Body() updateFcmReqDto: UpdateFcmReqDto): Promise<void> {
    return this.userService.updateFcm(updateFcmReqDto);
  }

  @ApiOperation({ summary: '유저 삭제 API' })
  @ApiBearerAuth()
  @Delete(':uid')
  deleteUser(@CurrentUser() targetId: string, @Param() param: UidReqDto): Promise<UpdateResultResDto> {
    return this.userService.deleteUser(targetId, param.uid);
  }
}
