import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupReqDto {
  @ApiProperty({ description: '모임명' })
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ApiProperty({ description: '친구 ID' })
  @IsArray()
  @IsNotEmpty()
  friendIds: string[];
}
