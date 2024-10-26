import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  constructor(
    @Inject('S3_CLIENT') private s3Client: S3Client,
    private configService: ConfigService,
  ) {}

  async imageUploadToS3(
    fileName: string, // 업로드될 파일의 이름
    file: any, // 업로드할 파일
    ext: string, // 파일 확장자
  ) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    const result = await this.s3Client.send(command);
    console.log(result);

    // 업로드된 이미지의 URL을 반환합니다.
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }

  async getSignedUrlS3(fileName: string) {
    // signedUrl 하나당 파일하나만 가능(여러번 시도시에 덮어쓰기)
    const filePath = `profile/image/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filePath,
    });

    // URL 유효시간 설정
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60, // seconds
    });

    return signedUrl;
  }
}
