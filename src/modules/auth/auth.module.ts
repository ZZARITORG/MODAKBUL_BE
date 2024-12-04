import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { USER_REPO, UserRepository } from '../repositories/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_REPO,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
