import { IsIn } from 'class-validator';
import { GenderType } from '../enum/gender-type.enum';
import { ProductStatus } from '../enum/product-status.enum';

export class GetStatusFilterDto {
  @IsIn([GenderType.kid, GenderType.unisex, GenderType.men, GenderType.women])
  readonly gender: GenderType;

  @IsIn([GenderType])
  readonly status: ProductStatus;
}
