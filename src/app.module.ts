import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        const synchronize = configService.get<boolean>('DB_SYNC_OPTION');

        return {
          type: 'postgres',
          database: configService.get<string>('DB_NAME'),
          host: configService.get<string>('DB_HOST'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          port: configService.get<number>('DB_PORT'),
          entities: [...indexEntities],
          timezone: 'z',
          synchronize: synchronize,
          logging: env === 'local' ? true : false,
        };
      },

      inject: [ConfigService],
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
  ],
})
export class AppModule {}
