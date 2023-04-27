import { IsBoolean, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  generalCategory: boolean;

  @ValidateIf((params) => params.generalCategory === false)
  @IsNumber()
  parentId: number;
}
