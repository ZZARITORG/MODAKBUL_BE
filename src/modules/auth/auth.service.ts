import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpReqDto } from './dtos/signup-req-dto';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPO) readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpReqDto: SignUpReqDto) {
    //아이디 중복 체크
    const existingAdmin = await this.userRepo.findUserById(signUpReqDto.id);
    if (existingAdmin) {
      throw new BadRequestException('이미 가입된 아이디입니다.');
    }
    const user = await this.userRepo.saveUser(signUpReqDto);

    //인증 토큰 생성
    const { accessToken, refreshToken } = await this.login(user.id);

    return { accessToken, refreshToken };
  }

  async login(id: string) {
    const user = await this.userRepo.findUserById(id);

    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userRepo.findUserById(decoded.id);

      const newAccessToken = this.jwtService.sign({ id: user.id }, { expiresIn: '2h' });

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
