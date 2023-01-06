import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
export class CreateCategoryDto {
  @IsString()
  name: string;


  @IsOptional()
  @IsBoolean()
  generalCategory: boolean;

  @ValidateIf((params) => params.generalCategory=== false)
  @IsNumber()
  parentId: number;
}
