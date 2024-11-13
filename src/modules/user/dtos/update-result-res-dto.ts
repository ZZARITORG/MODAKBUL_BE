import { ApiProperty } from '@nestjs/swagger';

export class UpdateResultResDto {
  @ApiProperty({
    description: '생성된 매핑 데이터 배열',
    example: [],
  })
  generatedMaps: any[];

  @ApiProperty({
    description: '원시 데이터 배열',
    type: [Object],
    example: [],
  })
  raw: any[];

  @ApiProperty({
    description: '영향받은 레코드 수',
    type: Number,
    example: 1,
  })
  affected: number;
}
