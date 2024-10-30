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
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNxd3FmcXdmd3FmIiwiaWF0IjoxNzMwMjkyMTQ1LCJleHAiOjE3MzI4ODQxNDV9.b4h67KDool0mrWH7N6UiTILgq_KbmU5kvUMhGu2ebtI
