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
    //중복 체크
    const existingAdmin = await this.userRepo.findOneBy([
      { phoneNo: signUpReqDto.phoneNo },
      { userId: signUpReqDto.userId },
    ]);

    if (existingAdmin) {
      throw new BadRequestException('이미 가입된 아이디 혹은 휴대번호입니다.');
    }

    const user = await this.userRepo.saveUser(signUpReqDto);

    if (!user) {
      throw new BadRequestException('회원 가입에 실패하였습니다.');
    }

    //인증 토큰 생성
    const { accessToken, refreshToken } = await this.login(user.phoneNo);

    return { accessToken, refreshToken };
  }

  async login(phoneNo: string) {
    const user = await this.userRepo.findOne({ where: { phoneNo } });

    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, fcmToken: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    const newToken = user.fcmToken.filter((item) => item !== fcmToken);

    user.fcmToken = newToken;

    await this.userRepo.save(user);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
      const user = await this.userRepo.findUserById(decoded.id);

      const newAccessToken = this.jwtService.sign({ id: user.id }, { expiresIn: '2h' });

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async userIdDuplication(userId: string): Promise<boolean> {
    const existingUser = await this.userRepo.findOne({ where: { userId } });
    return existingUser ? false : true;
  }

  async verifyPhoneNo(phoneNo: string): Promise<boolean> {
    const existingUser = await this.userRepo.findOne({ where: { phoneNo } });
    return existingUser ? true : false;
  }
}
