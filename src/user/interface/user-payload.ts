import { Role, UserStatus } from '@prisma/client';

export interface UserPayload {
  id: number;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  status: UserStatus;
}
