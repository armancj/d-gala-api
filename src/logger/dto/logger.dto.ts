import { IntersectionType } from '@nestjs/swagger';
import { DateRangeDTO, GetAllQueryDto } from '../../common/dto';
import { LoggerSearchDto } from './logger-search.dto';

export class LoggerDto extends IntersectionType(
  GetAllQueryDto,
  LoggerSearchDto,
  DateRangeDTO,
) {}
