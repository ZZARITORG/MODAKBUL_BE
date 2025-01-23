import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as _ from 'lodash';
import { Like } from 'typeorm';
import { LoginReqDto } from '../auth/dtos/login-req-dto';
import { FRIEND_REPO, FriendRepository } from '../repositories/friend.repository';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { GetUserResDto } from './dtos/get-user-res-dto';
import { UserSearchDto } from './dtos/search-user-dto';
import { UserSearchResDto, UserSearchResponseDto } from './dtos/search-user-res-dto';
import { UpdateFcmReqDto } from './dtos/update-fcm-req-dto';
import { UpdateResultResDto } from './dtos/update-result-res-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { FriendStatus } from 'src/common/db/entities/friendship.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPO) readonly userRepo: UserRepository,
    @Inject(FRIEND_REPO) readonly friendRepo: FriendRepository,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
    initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  async deleteUser(targetId: string, uid: string): Promise<UpdateResultResDto> {
    try {
      await getAuth().deleteUser(uid);
      const result = await this.userRepo.delete({ id: targetId });
      return plainToInstance(UpdateResultResDto, result);
    } catch (err) {
      console.error(err);
      throw new NotFoundException('User not found');
    }
  }

  async searchUsers(id: string, query: UserSearchDto): Promise<UserSearchResDto> {
    const search = query.search;
    const page = query.page;
    let isEnd = false;

    const [users, total] = await this.userRepo.findAndCount({
      where: [
        { name: Like(`%${search}%`) }, // 이름으로 검색
        { userId: Like(`%${search}%`) }, // ID로 검색
      ],
      relations: ['sentFriendships', 'receivedFriendships', 'sentFriendships.target', 'receivedFriendships.source'],
      skip: page * 20 - 20,
      take: 20,
      order: {
        id: 'ASC',
      },
    });

    if (total == 0) {
      return {
        users: [],
        isEnd: true,
      };
    }

    if (Math.ceil(total / 20) == page) {
      isEnd = true;
    }

    const filteredUsers = users.filter((user) => {
      const isBlockedBySent = !user.sentFriendships.some(
        (friendship) => friendship.target.id === id && friendship.status === FriendStatus.BLOCKED,
      );

      const isBlockedByReceived = !user.receivedFriendships.some(
        (friendship) => friendship.source.id === id && friendship.status === FriendStatus.BLOCKED,
      );

      return isBlockedBySent && isBlockedByReceived;
    });

    // UserResponseDto로 매핑
    return { users: plainToInstance(UserSearchResponseDto, filteredUsers, { excludeExtraneousValues: true }), isEnd };
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
    let source: string;
    let target: string;

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

    const mutualCount = await this.friendRepo.getMutualFriendCount(id, targetId);

    const status = user?.receivedFriendships[0]?.status ?? user?.sentFriendships[0]?.status ?? 'NONE';

    if (!_.isEmpty(user.sentFriendships)) {
      source = targetId;
      target = id;
    }
    if (!_.isEmpty(user.receivedFriendships)) {
      source = id;
      target = targetId;
    }

    return {
      id: user.id,
      userId: user.userId,
      name: user.name,
      phoneNo: user.phoneNo,
      profileUrl: user.profileUrl,
      status,
      mutualCount,
      sourceId: source,
      targetId: target,
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
