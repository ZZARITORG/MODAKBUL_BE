import { Controller, Delete } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete()
  deleteUser(@CurrentUser() targetId: string) {
    return this.userService.deleteUser(targetId);
  }
}
