import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileNameReqDto {
  @ApiProperty({ description: '파일명 -> USER 휴대폰번호와 같은 유니크한 값 입력' })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
