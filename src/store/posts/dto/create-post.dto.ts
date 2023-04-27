import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  published: true;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @IsOptional()
  categories: number[];

  @IsString()
  @IsNotEmpty()
  keywords: string[];

  @IsString({ each: true })
  @IsOptional()
  content: string[];
}
