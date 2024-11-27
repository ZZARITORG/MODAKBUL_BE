import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenReqDto } from './dtos/refresh-token-req-dto';
import { SignUpReqDto } from './dtos/signup-req-dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginReqDto } from './dtos/login-req-dto';
import { RefreshTokenResDto } from './dtos/refresh-token-res-dto';
import { TokenResDto } from './dtos/token-res-dto';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입 API' })
  @ApiResponse({ type: TokenResDto })
  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpReqDto: SignUpReqDto): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.signUp(signUpReqDto);
  }

  @ApiOperation({ summary: '로그인 API' })
  @ApiResponse({ type: TokenResDto })
  @Public()
  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    return await this.authService.login(loginReqDto.id);
  }

  @ApiOperation({ summary: '토큰 재발급 API' })
  @Public()
  @ApiResponse({ type: RefreshTokenResDto })
  @Post('refresh-token')
  async getAccessToken(@Body() refreshTokenReqDto: RefreshTokenReqDto) {
    return await this.authService.refreshAccessToken(refreshTokenReqDto.refreshToken);
  }
}
