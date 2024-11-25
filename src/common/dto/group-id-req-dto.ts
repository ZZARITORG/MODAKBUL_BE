import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GroupIdReqDto {
  @ApiProperty({ description: '대상 그룹 아이디' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
