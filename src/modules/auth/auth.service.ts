import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SignUpReqDto } from './dtos/signup-req-dto';
import { USER_REPO, UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(@Inject(USER_REPO) readonly userRepo: UserRepository) {}

  async signUp(signUpReqDto: SignUpReqDto) {
    const existingAdmin = await this.userRepo.findUserById(signUpReqDto.id);
    if (existingAdmin) {
      throw new BadRequestException('이미 가입된 아이디입니다.');
    }
    const user = await this.userRepo.saveUser(signUpReqDto);
    return user;
  }
}
