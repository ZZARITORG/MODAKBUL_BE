import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging-interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './common/filters/exception-filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { NotificationModule } from './modules/notification/notification.module';
import { FriendModule } from './modules/friend/friend.module';
import { GroupModule } from './modules/group/group.module';
import { UserModule } from './modules/user/user.module';
import { AwsModule } from './modules/aws/aws.module';
import { indexEntities } from './common/db/index.entities';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './common/gurad/auth.guard';

//TODO 한국시간으로 저장
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        const synchronize = configService.get<string>('DB_SYNC_OPTION') === 'true';

        return {
          type: 'postgres',
          database: configService.get<string>('DB_NAME'),
          host: configService.get<string>('DB_HOST'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          port: configService.get<number>('DB_PORT'),
          entities: [...indexEntities],
          timezone: '+09:00',
          synchronize: synchronize,
          logging: env === 'local' ? true : false,
        };
      },

      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cnf: ConfigService) => ({
        secret: cnf.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '30m' },
      }),
      global: true,
    }),
    TypeOrmModule.forFeature(),
    AuthModule,
    MeetingModule,
    NotificationModule,
    FriendModule,
    GroupModule,
    UserModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          transform: true,
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
