import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EnumUserRole } from '../../user/enum/user-role.enum';
import { JwtAuthGuard, RolesGuard } from '../../auth/guard';
export function Auth() {
  return applyDecorators(
    SetMetadata('roles', EnumUserRole.SUADMIN),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'No authorized' }),
    ApiForbiddenResponse({ description: 'Prohibit.' }),
  );
}
