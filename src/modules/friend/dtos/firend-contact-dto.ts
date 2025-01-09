import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
export class FriendContactDto {
  @ApiProperty({ description: '연락처 목록', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional() // 필수 항목이 아님
  contacts?: string[];
}
