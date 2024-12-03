import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPhoneNoReqDto {
  @ApiProperty({ description: '휴대폰 번호' })
  @IsString()
  @IsNotEmpty()
  phoneNo: string;
}
