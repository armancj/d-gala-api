import { OmitType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto extends OmitType(RegisterUserDto, [
  'firstname',
  'lastname',
  'email',
  'phone',
  'role',
] as const) {}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
