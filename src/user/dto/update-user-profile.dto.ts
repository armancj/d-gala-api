import { OmitType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto extends OmitType(UpdateUserDto, [
  'role',
  'status',
] as const) {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(555)
  bio: string;
}
