import { PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto extends PartialType(UpdateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  bio: string;
}
