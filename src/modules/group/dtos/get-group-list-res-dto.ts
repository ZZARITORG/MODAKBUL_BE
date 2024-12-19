import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 'c3b9306a-4b92-4bb8-bb40-20e8f521867e',
  })
  id: string;

  @ApiProperty({
    example: 'testid5',
  })
  userId: string;

  @ApiProperty({
    example: '김태희',
  })
  name: string;

  @ApiProperty({
    example: 'string',
  })
  profileUrl: string;
}

// member.dto.ts
export class MemberDto {
  @ApiProperty({
    example: 'efa4af78-04ef-410a-b15a-d327cc0d7640',
  })
  id: string;

  @ApiProperty({
    type: UserDto,
  })
  user: UserDto;
}

// group.dto.ts
export class GetGroupListResDto {
  @ApiProperty({
    example: 'b2311132-dbb1-4fe1-b098-8d3fc4b19815',
  })
  id: string;

  @ApiProperty({
    example: '번개모임',
  })
  name: string;

  @ApiProperty({
    type: [MemberDto],
  })
  members: MemberDto[];

  @ApiProperty({ description: '자주만난 횟수' })
  count: number;

  @ApiProperty({ description: '업데이트된 시간' })
  createdAt: Date;

  @ApiProperty({ description: '업데이트된 시간' })
  updatedAt: Date;
}
