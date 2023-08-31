import {
  IsInt,
  IsPositive,
  IsString,
  IsIn,
  IsOptional,
  IsNotEmpty, IsDate,
} from 'class-validator';

export class GetAllQueryV2Dto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  page?: number = 1;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  take?: number = 10;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  sortBy?: string;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  @IsNotEmpty()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  searchBy?: string;

  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  toDate?: Date;
}
