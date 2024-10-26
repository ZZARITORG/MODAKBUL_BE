import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';

@Module({
  imports: [],
  controllers: [AwsController],
  providers: [
    {
      provide: 'S3_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_S3_ACCESS_KEY')!,
            secretAccessKey: configService.get('AWS_S3_SECRET_ACCESS_KEY')!,
          },
        });
      },
    },
    AwsService,
  ],
  exports: [AwsService],
})
export class AwsModule {}
