import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UidReqDto {
  @ApiProperty({ description: 'firebase uid' })
  @IsString()
  @IsNotEmpty()
  uid: string;
}
