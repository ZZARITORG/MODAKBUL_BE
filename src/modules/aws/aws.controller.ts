import { Controller, Get, Param } from '@nestjs/common';
import * as fs from 'fs';
import { AwsService } from './aws.service';
@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get('upload-Basic-Profile')
  uploadBasicProfile(): any {
    const filePath = '/Users/baecheolhyeon/Downloads/EFICAR-ERD.pdf';
    const filename = 'profile/basic';
    // 파일을 Buffer로 읽기
    const fileContent = fs.readFileSync(filePath);

    return this.awsService.imageUploadToS3(filename, fileContent, 'pdf');
  }

  @Get('presigned/:fileName')
  async getPreSignedUrl(@Param('fileName') fileName: string): Promise<string> {
    return await this.awsService.getSignedUrlS3(fileName);
  }
}
