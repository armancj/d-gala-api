import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DateRangeDTO {
  //@IsISO8601()
  @IsOptional()
  @Transform((value) => new Date(value.value))
  readonly fromDate?: Date;

  //@IsISO8601()
  @IsOptional()
  @Transform((value) => new Date(value.value))
  readonly toDate?: Date;
}
