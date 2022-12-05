import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class RangeDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly offset: number;

  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(1000)
  readonly limit: number;
}
