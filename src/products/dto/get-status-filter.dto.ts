import { IsIn, IsOptional } from 'class-validator';
import { GenderType } from '../enum/gender-type.enum';
import { ProductStatus } from '../enum/product-status.enum';

export class GetStatusFilterDto {
  @IsIn([GenderType.kid, GenderType.unisex, GenderType.men, GenderType.women])
  @IsOptional()
  readonly gender?: GenderType;

  @IsOptional()
  @IsIn([GenderType])
  readonly status?: ProductStatus;
}
