import { Role, UserStatus } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class UserResponse {
  @IsNumber()
  id: number;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: UserStatus;
}
