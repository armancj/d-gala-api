import { ApiProperty } from '@nestjs/swagger';

export class CustomResult {
  @ApiProperty({
    description: 'It does contains the content of query',
  })
  result: any;

  @ApiProperty({ description: 'Total result on database' })
  count: number;

  skip: number;

  take: number;
}
