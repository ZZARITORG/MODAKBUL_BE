import { Inject, Injectable } from '@nestjs/common';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { UserSearchDto } from './dtos/search-user-dto';
import { User } from 'src/common/db/entities/user.entity';
import { Like } from 'typeorm';
import { UserSearchResponseDto } from './dtos/search-user-res-dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) readonly userRepo: UserRepository) {}

  async deleteUser(targetId: string) {
    return await this.userRepo.deleteUser(targetId);
  }
  async searchUsers(userSearchDto: UserSearchDto): Promise<UserSearchResponseDto[]> {
    const { search } = userSearchDto;
    const users = await this.userRepo.find({
      where: [
        { name: Like(`%${search}%`) }, // 이름으로 검색
        { userId: Like(`%${search}%`) }, // ID로 검색
      ],
    });

    // UserResponseDto로 매핑
    return users.map((user) => ({
      id: user.id,
      userId: user.userId,
      name: user.name,
      profileUrl: user.profileUrl,
    }));
  }
}
