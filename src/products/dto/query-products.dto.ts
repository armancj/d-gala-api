import { IntersectionType } from '@nestjs/swagger';
import { GetStatusFilterDto } from './get-status-filter.dto';
import { GetAllQueryDto } from '../../common/dto';

export class QueryProductsDto extends IntersectionType(
  GetStatusFilterDto,
  GetAllQueryDto,
) {}
