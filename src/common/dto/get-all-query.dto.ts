import { DefaultValue } from '../enum/default-value.enum';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class GetAllQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number = DefaultValue.Skip;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  take?: number = DefaultValue.Limit;

  @IsString()
  @IsOptional()
  search?: string;
}
