import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateResultResDto } from '../user/dtos/update-result-res-dto';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { CreateGroupResDto } from './dtos/create-group-res.dto';
import { GetGroupListResDto } from './dtos/get-group-list-res-dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '그룹 전체 조회 API' })
  @Get()
  getAllGroup(@CurrentUser() targetId: string): Promise<GetGroupListResDto[]> {
    return this.groupService.getAllGroup(targetId);
  }

  @ApiOperation({ summary: '그룹 생성 API' })
  @Post()
  createGroup(@Body() createGroupDto: CreateGroupReqDto, @CurrentUser() targetId: string): Promise<CreateGroupResDto> {
    return this.groupService.createGroup(createGroupDto, targetId);
  }

  @ApiOperation({ summary: '그룹 수정 API' })
  @Put(':groupId')
  updateGroup(
    @Param('groupId') groupId: string,
    @Body() updateGroupDto: CreateGroupReqDto,
  ): Promise<UpdateResultResDto> {
    return this.groupService.updateGroup(groupId, updateGroupDto);
  }

  @ApiOperation({ summary: '그룹 삭제 API' })
  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string): Promise<UpdateResultResDto> {
    return this.groupService.deleteGroup(groupId);
  }
}
