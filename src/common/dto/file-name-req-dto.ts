import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FileNameReqDto {
  @ApiProperty({ description: '파일명 -> USER UUID 입력' })
  @IsUUID()
  @IsNotEmpty()
  fileName: string;
}
