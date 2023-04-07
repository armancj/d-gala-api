import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard, JwtAuthGuard } from '../../authentication/guard';
import { EnumUserRole } from '../../user/enum/user-role.enum';
export function Auth() {
  return applyDecorators(
    SetMetadata('roles', EnumUserRole.SUADMIN),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'No authorized' }),
    ApiForbiddenResponse({ description: 'Prohibit.' }),
  );
}
