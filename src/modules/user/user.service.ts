import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Like } from 'typeorm';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { GetUserResDto } from './dtos/get-user-res-dto';
import { UserSearchResponseDto } from './dtos/search-user-res-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UpdateResultResDto } from './dtos/update-result-res-dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) readonly userRepo: UserRepository) {}

  async deleteUser(targetId: string): Promise<UpdateResultResDto> {
    const result = await this.userRepo.delete({ id: targetId });
    return plainToInstance(UpdateResultResDto, result);
  }

  async searchUsers(userSearchDto: string): Promise<UserSearchResponseDto[]> {
    const search = userSearchDto;
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

  async getUsers(userId: string): Promise<GetUserResDto> {
    const user = await this.userRepo.findUserById(userId);
    return plainToInstance(GetUserResDto, user);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateResultResDto> {
    const result = await this.userRepo.update(userId, updateUserDto);
    return plainToInstance(UpdateResultResDto, result);
  }

  async getUser(userId: string): Promise<GetUserResDto> {
    const user = await this.userRepo.findUserById(userId);
    return plainToInstance(GetUserResDto, user);
  }
}
