import { Body, Controller, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupReqDto } from './dtos/create-group-req.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupReqDto, @CurrentUser() userId: string) {
    return this.groupService.createGroup(createGroupDto, userId);
  }
}
