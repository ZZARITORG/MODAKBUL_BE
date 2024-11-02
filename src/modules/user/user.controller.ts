import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSearchDto } from './dtos/search-user-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async searchUsers(@Query() query: UserSearchDto) {
    return this.userService.searchUsers(query);
  }
}
