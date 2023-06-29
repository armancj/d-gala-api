import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto extends PickType(RegisterUserDto, [
  'username',
  'password',
] as const) {}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
