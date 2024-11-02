import { Inject, Injectable } from '@nestjs/common';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { UserSearchDto } from './dtos/search-user-dto';
import { User } from 'src/common/db/entities/user.entity';
import { Like } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) readonly userRepo: UserRepository) {}

  async deleteUser(targetId: string) {
    return await this.userRepo.deleteUser(targetId);
  }
  async searchUsers(userSearchDto: UserSearchDto): Promise<User[]> {
    const { search } = userSearchDto;
    return this.userRepo.find({
      where: [
        { name: Like(`%${search}%`) }, // 이름으로 검색
        { userId: Like(`%${search}%`) }, // ID로 검색
      ],
    });
  }
}
