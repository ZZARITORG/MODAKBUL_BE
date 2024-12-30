import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Like } from 'typeorm';
import { FRIEND_REPO, FriendRepository } from '../repositories/friend.repository';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { GetUserResDto } from './dtos/get-user-res-dto';
import { UserSearchResponseDto } from './dtos/search-user-res-dto';
import { UpdateResultResDto } from './dtos/update-result-res-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import * as _ from 'lodash';
import { UpdateFcmReqDto } from './dtos/update-fcm-req-dto';
import { LoginReqDto } from '../auth/dtos/login-req-dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPO) readonly userRepo: UserRepository,
    @Inject(FRIEND_REPO) readonly friendRepo: FriendRepository,
  ) {}

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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResultResDto> {
    if (updateUserDto.userId) {
      const existingUserId = await this.userRepo.findOne({
        where: { userId: updateUserDto.userId },
      });

      if (!_.isEmpty(existingUserId)) {
        throw new BadRequestException(`${updateUserDto.userId} 아이디가 이미 존재합니다.`);
      }
    }

    if (updateUserDto.phoneNo) {
      const existingPhoneNo = await this.userRepo.findOne({
        where: { phoneNo: updateUserDto?.phoneNo },
      });

      if (!_.isEmpty(existingPhoneNo)) {
        throw new BadRequestException(`${updateUserDto.phoneNo} 휴대폰 번호가 이미 존재합니다.`);
      }
    }

    const result = await this.userRepo.update(id, updateUserDto);
    return plainToInstance(UpdateResultResDto, result);
  }

  async getUser(id: string, targetId: string) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.sentFriendships',
        'sentFriendships',
        'sentFriendships.source_id = :id OR sentFriendships.target_id = :id',
        {
          id,
        },
      )
      .leftJoinAndSelect(
        'user.receivedFriendships',
        'receivedFriendships',
        'receivedFriendships.source_id = :id OR receivedFriendships.target_id = :id',
        {
          id,
        },
      )
      .where('user.id = :targetId', { targetId })
      .getOne();

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    const status = user?.receivedFriendships[0]?.status ?? user?.sentFriendships[0]?.status ?? 'NONE';

    return {
      id: user.id,
      userId: user.userId,
      name: user.name,
      phoneNo: user.phoneNo,
      profileUrl: user.profileUrl,
      status,
    };
  }

  async updateFcm(updateFcmReqDto: UpdateFcmReqDto | LoginReqDto): Promise<void> {
    const user = await this.userRepo.findOne({ where: { phoneNo: updateFcmReqDto.phoneNo } });

    if (_.isEmpty(user)) {
      throw new BadRequestException('해당 유저가 존재하지 않습니다.');
    }

    if (!user.fcmToken.includes(updateFcmReqDto.fcmToken)) {
      user.fcmToken.push(updateFcmReqDto.fcmToken);
    }

    await this.userRepo.save(user);

    return;
  }
}
