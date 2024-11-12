import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserSearchDto } from './dtos/search-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@CurrentUser() userId: string) {
    return this.userService.getUsers(userId);
  }

  @Get('search=:search')
  async searchUsers(@Param('search') search: string) {
    const query: UserSearchDto = { search };
    return this.userService.searchUsers(query);
  }

  @Patch()
  async updateUser(@CurrentUser() userId: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete()
  deleteUser(@CurrentUser() targetId: string) {
    return this.userService.deleteUser(targetId);
  }
}
