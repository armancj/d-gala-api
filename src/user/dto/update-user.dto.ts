import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'phone',
] as const) {
  @ApiProperty({
    enum: [UserStatus.ACTIVE, UserStatus.DEACTIVE],
    description: `${UserStatus.ACTIVE} or ${UserStatus.DEACTIVE}`,
  })
  @IsEnum(UserStatus, {
    message: `The Status are ${UserStatus.ACTIVE} or ${UserStatus.DEACTIVE}`,
  })
  @IsOptional()
  status: UserStatus;
}
