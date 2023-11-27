import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { EnumUserRole } from '../../user/enum/user-role.enum';

import { RolesGuard } from '../guard';

export function Auth(...roles: EnumUserRole[]) {
  if (roles.length === 0)
    roles = [
      EnumUserRole.USER,
      EnumUserRole.ADMIN,
      EnumUserRole.WORKER,
      EnumUserRole.SUADMIN,
    ];

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
