import { IsISO8601 } from 'class-validator';
import { Transform } from 'class-transformer';

export class DateRangeDTO {
  @Transform((value) => new Date(value.value))
  @IsISO8601()
  readonly date1: Date;

  @Transform((value) => new Date(value.value))
  @IsISO8601()
  readonly date2: Date;
}
