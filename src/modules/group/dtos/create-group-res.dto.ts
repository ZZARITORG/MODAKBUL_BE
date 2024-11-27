import { ApiProperty } from '@nestjs/swagger';

// user.dto.ts
export class UserDto {
  @ApiProperty({
    example: 'a13730ba-934c-44e0-abde-1d359509a59a',
  })
  id: string;

  @ApiProperty({
    example: 'xogus100',
  })
  userId: string;

  @ApiProperty({
    example: '김태현',
  })
  name: string;

  @ApiProperty({
    example: '01012345678',
  })
  phoneNo: string;

  @ApiProperty({
    example: 'string',
  })
  profileUrl: string;

  @ApiProperty({
    example: 'string',
  })
  fcmToken: string;
}

// member.dto.ts
export class MemberDto {
  @ApiProperty({
    example: '0eb5d14b-f80d-4930-a074-c49db984f984',
  })
  id: string;

  @ApiProperty({
    type: () => UserDto,
  })
  user: UserDto;
}

// group.dto.ts
export class CreateGroupResDto {
  @ApiProperty({
    example: '541c4fd0-bb37-4b6b-9817-f117bb63629f',
  })
  id: string;

  @ApiProperty({
    example: '그룹명',
  })
  name: string;

  @ApiProperty({
    type: () => UserDto,
  })
  owner: UserDto;

  @ApiProperty({
    type: () => [MemberDto],
  })
  members: MemberDto[];
}
