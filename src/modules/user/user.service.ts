import { Inject, Injectable } from '@nestjs/common';
import { USER_REPO, UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) readonly userRepo: UserRepository) {}

  async deleteUser(targetId: string) {
    return await this.userRepo.deleteUser(targetId);
  }
}
