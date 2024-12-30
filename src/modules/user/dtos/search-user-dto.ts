import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { StringToNumber } from 'src/common/decorators/zzarit.decorator';

export class UserSearchDto {
  @ApiProperty({ description: '검색어( 유저 이름 or 유저 ID 넣어주세요)' })
  @IsNotEmpty()
  @IsString()
  search: string;

  @ApiProperty({ description: 'page 번호 (기본값은 1입니다~)', required: false })
  @IsOptional()
  @IsNumber()
  @StringToNumber()
  page: number = 1;
}
