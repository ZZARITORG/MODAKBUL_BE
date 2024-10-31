import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  getAllGroup(@CurrentUser() targetId: string) {
    return this.groupService.getAllGroup(targetId);
  }

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupReqDto, @CurrentUser() targetId: string) {
    return this.groupService.createGroup(createGroupDto, targetId);
  }

  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }
}
