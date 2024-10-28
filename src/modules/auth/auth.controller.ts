import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpReqDto } from './dtos/signup-req-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpReqDto: SignUpReqDto) {
    return await this.authService.signUp(signUpReqDto);
  }
}
