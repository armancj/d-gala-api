import { IntersectionType } from '@nestjs/swagger';
import { GetStatusFilterDto } from './get-status-filter.dto';
import { GetAllQueryDto } from '../../../common/dto';
import { OrderByDto } from './order-by-.dto';
import { QueryColorImagesLimitDto } from './query-color-images-limit.dto';

export class QueryProductsDto extends IntersectionType(
  GetStatusFilterDto,
  GetAllQueryDto,
  OrderByDto,
  QueryColorImagesLimitDto,
) {}
