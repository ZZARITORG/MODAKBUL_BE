import { Inject, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { UserSearchDto } from './dtos/search-user-dto';
import { UserSearchResponseDto } from './dtos/search-user-res-dto';
import { UpdateUserDto } from './dtos/update-user-dto';

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

  async getUsers(userId: string) {
    return await this.userRepo.findUserById(userId);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(userId, updateUserDto);
  }
}
