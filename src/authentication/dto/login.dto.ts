import { OmitType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class LoginDto extends OmitType(RegisterUserDto, [
  'firstname',
  'lastname',
  'email',
  'phone',
  'role',
] as const) {}
