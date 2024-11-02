import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/db/entities/user.entity';
import { Repository, Like } from 'typeorm';
import { UserSearchDto } from './dtos/search-user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async searchUsers(userSearchDto: UserSearchDto): Promise<User[]> {
    const { search } = userSearchDto;
    return this.userRepository.find({
      where: [
        { name: Like(`%${search}%`) }, // 이름으로 검색
        { userId: Like(`%${search}%`) }, // ID로 검색
      ],
    });
  }
}
