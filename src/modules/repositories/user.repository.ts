import { Injectable } from '@nestjs/common';
import { User } from 'src/common/db/entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { SignUpReqDto } from '../auth/dtos/signup-req-dto';
export const USER_REPO = 'USER_REPO';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(id: string): Promise<User> {
    return this.createQueryBuilder().where('id = :id', { id }).getOne();
  }
  async findUsersByIds(ids: string[]) {
    return await this.findBy({
      id: In(ids),
    });
  }
  async findUserByUserId(userId: string) {
    return this.createQueryBuilder().where('user_id = :userId', { userId }).getOne();
  }

  async saveUser(signUpReqDto: SignUpReqDto) {
    const user = this.create({
      userId: signUpReqDto.userId,
      name: signUpReqDto.name,
      phoneNo: signUpReqDto.phoneNo,
      profileUrl: signUpReqDto.profileUrl,
      fcmToken: signUpReqDto.fcmToken,
      isContactAgree: signUpReqDto.isContactAgree,
    });

    const result = await this.save(user);

    return result;
  }
}
