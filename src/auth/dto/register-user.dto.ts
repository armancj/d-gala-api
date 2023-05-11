import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
