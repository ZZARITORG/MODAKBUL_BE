import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateMeetingGroupReqDto {
  @ApiProperty({ description: '제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '장소명 (ex:서현역 콩쥐팥쥐)' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ description: '도로명주소 (ex:경기 성남시 분당구 ...)' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: '상세주소 (ex:콩팥 10번 테이블)' })
  @IsString()
  @IsNotEmpty()
  detailAddress: string;

  @ApiProperty({ description: '약속 날짜,시간 (약속시각은 UTC기준으로 보내주세요)' })
  @IsString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ description: '위도' })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ description: '경도' })
  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({ description: '모닥불 초대 그룹 ID' })
  @IsUUID()
  @IsNotEmpty()
  groupId: string;
}
