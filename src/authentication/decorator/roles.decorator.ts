import { SetMetadata } from '@nestjs/common';
import { EnumUserRole } from '../../user/enum/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EnumUserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
