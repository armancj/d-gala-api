import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EnumUserRole } from '../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: [EnumUserRole.USER, EnumUserRole.ADMIN, EnumUserRole.WORKER],
    description: `${EnumUserRole.USER}, ${EnumUserRole.ADMIN} or ${EnumUserRole.WORKER}`,
  })
  @IsEnum(EnumUserRole, {
    message: `The Roles are ${EnumUserRole.USER}, ${EnumUserRole.ADMIN} or ${EnumUserRole.WORKER}`,
  })
  @IsOptional()
  role?: EnumUserRole;
}