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

  async findUserById(id: string) {
    return this.createQueryBuilder().where('id = :id', { id }).getOne();
  }
  async findUsersByIds(ids: string[]) {
    return await this.findBy({
      id: In(ids),
    });
  }

  async saveUser(signUpReqDto: SignUpReqDto) {
    const user = this.create({
      id: signUpReqDto.id,
      name: signUpReqDto.name,
      phoneNo: signUpReqDto.phoneNo,
      profileUrl: signUpReqDto.profileUrl,
      fcmToken: signUpReqDto.fcmToken,
    });

    const result = await this.save(user);

    return result;
  }
}
