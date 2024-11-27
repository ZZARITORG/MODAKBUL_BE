import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AwsService } from './aws.service';
import { FileNameReqDto } from 'src/common/dto/file-name-req-dto';

@Controller('aws')
@ApiTags('AWS')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  // @Get('upload-Basic-Profile')
  // uploadBasicProfile(): Promise<string> {
  //   const filePath = '/Users/baecheolhyeon/Downloads/EFICAR-ERD.pdf';
  //   const filename = 'profile/basic';
  //   // 파일을 Buffer로 읽기
  //   const fileContent = fs.readFileSync(filePath);

  //   return this.awsService.imageUploadToS3(filename, fileContent, 'pdf');
  // }

  @ApiOperation({ summary: 'S3 업로드 URl 요청 API' })
  @ApiBearerAuth()
  @ApiResponse({ description: 'PreSignedURL' })
  @Get('presigned/:fileName')
  async getPreSignedUrl(@Param() param: FileNameReqDto) {
    return await this.awsService.getSignedUrlS3(param.fileName);
  }
}
