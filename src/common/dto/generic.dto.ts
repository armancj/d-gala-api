import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RangeDTO } from './range.dto';

export class ICreateDto<T> {
  constructor(e: T) {
    return e;
  }
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class OrderDto {
  @IsOptional()
  @IsEnum(OrderEnum)
  order: OrderEnum;

  @IsNotEmpty()
  @IsString()
  propertyName: string;
}
export class IDto {
  @IsObject()
  @ValidateNested()
  @Type(() => RangeDTO)
  range: RangeDTO;

  @ValidateNested()
  @Type(() => OrderDto)
  order?: OrderDto;
}
