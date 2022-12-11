import { Role, UserStatus } from '@prisma/client';

export interface UserPayload {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}
