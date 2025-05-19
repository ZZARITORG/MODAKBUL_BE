import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenReqDto } from './dtos/refresh-token-req-dto';
import { SignUpReqDto } from './dtos/signup-req-dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from '../user/user.service';
import { DuplicateReqDto } from './dtos/duplicate-req-dto';
import { LoginReqDto } from './dtos/login-req-dto';
import { LogoutReqDto } from './dtos/logout-req-dto';
import { RefreshTokenResDto } from './dtos/refresh-token-res-dto';
import { TokenResDto } from './dtos/token-res-dto';
import { VerifyPhoneNoReqDto } from './dtos/verify-phone-no-req-dto';

@Controller({ path: 'auth', version: '0' })
@ApiTags('AUTH')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '회원가입 API' })
  @ApiResponse({ type: TokenResDto })
  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpReqDto: SignUpReqDto): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.signUp(signUpReqDto);
  }

  @ApiOperation({ summary: '로그인 API', description: '새로운 FCM이면 DB에 저장' })
  @ApiResponse({ type: TokenResDto })
  @Public()
  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    await this.userService.updateFcm(loginReqDto);

    return await this.authService.login(loginReqDto.phoneNo);
  }

  @ApiOperation({ summary: '토큰 재발급 API' })
  @Public()
  @ApiResponse({ type: RefreshTokenResDto })
  @Post('refresh-token')
  async getAccessToken(@Body() refreshTokenReqDto: RefreshTokenReqDto) {
    return await this.authService.refreshAccessToken(refreshTokenReqDto.refreshToken);
  }

  @ApiOperation({ summary: '휴대번호 중복확인 API', description: '휴대번호 존재하면 true, 사용가능하면 false' })
  @Public()
  @Post('phoneNo')
  async verifyPhoneNo(@Body() body: VerifyPhoneNoReqDto): Promise<boolean> {
    console.log(body);
    return await this.authService.verifyPhoneNo(body.phoneNo);
  }

  @ApiOperation({ summary: '로그아웃', description: 'FCM DB에서 삭제' })
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Body() body: LogoutReqDto, @CurrentUser() userId: string): Promise<void> {
    return await this.authService.logout(userId, body.fcmToken);
  }

  @ApiOperation({ summary: 'userId 중복확인 API', description: '이미 id 존재하면 false, 사용가능하면 true' })
  @Public()
  @Get(':userId')
  async userIdDuplication(@Param() param: DuplicateReqDto): Promise<boolean> {
    return await this.authService.userIdDuplication(param.userId);
  }
}
