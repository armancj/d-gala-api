import { IsEmail, IsInt, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsEmail()
  readonly email: string;

  @Length(8, 15)
  readonly password: string;

  @IsInt()
  readonly code: number;
}
