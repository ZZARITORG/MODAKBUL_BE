import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserIdReqDto } from 'src/common/dto/user-id-req-dto';
import { GetUserResDto } from './dtos/get-user-res-dto';
import { UserSearchResponseDto } from './dtos/search-user-res-dto';
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
  async searchUsers(@Query('search') search: string): Promise<UserSearchResponseDto[]> {
    return this.userService.searchUsers(search);
  }

  @ApiOperation({ summary: '본인 정보 조회 API' })
  @ApiBearerAuth()
  @Get('me')
  async getUsers(@CurrentUser() userId: string): Promise<GetUserResDto> {
    return this.userService.getUsers(userId);
  }

  @ApiOperation({ summary: '유저 정보 조회 API' })
  @ApiBearerAuth()
  @Get(':id')
  async getUser(@CurrentUser() id: string, @Param() param: UserIdReqDto): Promise<GetUserResDto> {
    return this.userService.getUser(id, param.id);
  }

  @ApiOperation({ summary: '유저 정보 수정 API' })
  @ApiBearerAuth()
  @Patch()
  async updateUser(@CurrentUser() userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResultResDto> {
    console.log(updateUserDto);
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: '유저 삭제 API' })
  @ApiBearerAuth()
  @Delete()
  deleteUser(@CurrentUser() targetId: string): Promise<UpdateResultResDto> {
    return this.userService.deleteUser(targetId);
  }
}
