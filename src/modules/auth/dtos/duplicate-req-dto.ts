import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DuplicateReqDto {
  @ApiProperty({ description: '사용자 userID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
