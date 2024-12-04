import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HyphenTel } from 'src/common/decorators/trans-phone-no.decorator';

export class VerifyPhoneNoReqDto {
  @ApiProperty({ description: '휴대폰 번호' })
  @HyphenTel()
  @IsString()
  @IsNotEmpty()
  phoneNo: string;
}
