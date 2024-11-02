import { Controller, Delete, Get, Query } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UserSearchDto } from './dtos/search-user-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  deleteUser(@CurrentUser() targetId: string) {
    return this.userService.deleteUser(targetId);
  }
  @Get()
  async searchUsers(@Query() query: UserSearchDto) {
    return this.userService.searchUsers(query);
  }
}
