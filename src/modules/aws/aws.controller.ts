import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { FileNameReqDto } from 'src/common/dto/file-name-req-dto';
import { AwsService } from './aws.service';
const fs = require('fs');

@Controller('aws')
@ApiTags('AWS')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  // @Get('upload-Basic-Profile')
  // @Public()
  // uploadBasicProfile(): Promise<string> {
  //   const filePath = '/Users/baecheolhyein/Documents/default_profile.jpg';
  //   const filename = 'profile/image/default';
  //   // 파일을 Buffer로 읽기
  //   const fileContent = fs.readFileSync(filePath);

  //   return this.awsService.imageUploadToS3(filename, fileContent, 'jpg');
  // }

  @ApiOperation({ summary: 'S3 업로드 URl 요청 API' })
  @ApiResponse({ description: 'PreSignedURL' })
  @Public()
  @Get('presigned/:fileName')
  async getPreSignedUrl(@Param() param: FileNameReqDto) {
    return await this.awsService.getSignedUrlS3(param.fileName);
  }
}
