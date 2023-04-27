import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsOptional()
  @Min(1)
  @Max(5)
  @IsInt()
  rating?: number;
}
