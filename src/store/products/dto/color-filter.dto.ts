import { IsHexColor, IsNotEmpty, IsOptional } from 'class-validator';

export class ColorFilterDto {
  @IsHexColor()
  @IsNotEmpty()
  @IsOptional()
  hexadecimal?: string;
}
