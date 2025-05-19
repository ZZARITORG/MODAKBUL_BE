import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateResultResDto } from '../user/dtos/update-result-res-dto';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { CreateGroupResDto } from './dtos/create-group-res.dto';
import { GetGroupListResDto } from './dtos/get-group-list-res-dto';
import { GroupService } from './group.service';
import { GroupIdReqDto } from 'src/common/dto/group-id-req-dto';

@Controller({ path: 'group', version: '0' })
@ApiTags('GROUP')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '그룹 전체 조회 API' })
  @ApiBearerAuth()
  @Get()
  getAllGroup(@CurrentUser() targetId: string): Promise<GetGroupListResDto[]> {
    return this.groupService.getAllGroup(targetId);
  }

  @ApiOperation({ summary: '그룹 생성 API' })
  @ApiBearerAuth()
  @Post()
  createGroup(@Body() createGroupDto: CreateGroupReqDto, @CurrentUser() targetId: string): Promise<CreateGroupResDto> {
    return this.groupService.createGroup(createGroupDto, targetId);
  }

  @ApiOperation({ summary: '그룹 수정 API' })
  @ApiBearerAuth()
  @Put(':id')
  updateGroup(@Param() param: GroupIdReqDto, @Body() updateGroupDto: CreateGroupReqDto): Promise<UpdateResultResDto> {
    return this.groupService.updateGroup(param.id, updateGroupDto);
  }

  @ApiOperation({ summary: '그룹 삭제 API' })
  @ApiBearerAuth()
  @Delete(':id')
  deleteGroup(@Param() param: GroupIdReqDto): Promise<UpdateResultResDto> {
    return this.groupService.deleteGroup(param.id);
  }
}
