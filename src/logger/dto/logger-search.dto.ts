import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { LoggerEnum, RequestMethod } from '../config/logger.const';

export class LoggerSearchDto {
  @IsString()
  @IsOptional()
  searchMessage?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @IsInt()
  contentLength?: number;

  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsOptional()
  statusCode?: number;

  @IsIn([
    RequestMethod.GET,
    RequestMethod.DELETE,
    RequestMethod.PUT,
    RequestMethod.PATCH,
    RequestMethod.POST,
  ])
  @IsOptional()
  method?: RequestMethod;

  @IsIn([LoggerEnum.http, LoggerEnum.warn, LoggerEnum.error])
  @IsOptional()
  statusLog?: LoggerEnum;
}
