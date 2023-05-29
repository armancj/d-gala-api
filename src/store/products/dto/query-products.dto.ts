import { IntersectionType } from '@nestjs/swagger';
import { GetStatusFilterDto } from './get-status-filter.dto';
import { GetAllQueryDto } from '../../../common/dto';
import { OrderByDto } from './order-by-.dto';

export class QueryProductsDto extends IntersectionType(
  GetStatusFilterDto,
  GetAllQueryDto,
  OrderByDto,
) {}
