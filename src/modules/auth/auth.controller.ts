import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpReqDto } from './dtos/signup-req-dto';
import { RefreshTokenReqDto } from './dtos/refresh-token-req-dto';

import { Public } from 'src/common/decorators/public.decorator';
import { LoginReqDto } from './dtos/login-req-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpReqDto: SignUpReqDto): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.signUp(signUpReqDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto) {
    return await this.authService.login(loginReqDto.id);
  }

  @Public()
  @Post('refresh-token')
  async getAccessToken(@Body() refreshTokenReqDto: RefreshTokenReqDto) {
    return await this.authService.refreshAccessToken(refreshTokenReqDto.refreshToken);
  }
}
