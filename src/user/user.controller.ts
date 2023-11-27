import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetAllQueryDto, GetAllResponseDto } from '../common/dto';
import { UserResponse } from './interface/user.response';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { Auth, GetUser } from '../auth/decorator';
import { EnumUserRole } from './enum/user-role.enum';
import { UserPayload } from './interface/user-payload';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from '@prisma/client';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    type: UserResponse,
  })
  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.USER)
  @Get()
  @ApiOkResponse({ type: GetAllResponseDto })
  findAllUser(@Query() query: GetAllQueryDto) {
    return this.userService.findAll({ skip: +query?.skip, take: +query?.take });
  }

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.USER)
  @Get('profile')
  getProfile(@GetUser() user: UserPayload) {
    return this.userService.findOne(+user.id);
  }
  @Get(':id')
  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN)
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.USER)
  @Patch('updateReview-profile')
  updateProfile(
    @GetUser() user: User,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfileUser(user, updateUserProfileDto);
  }

  @Patch(':id')
  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN)
  updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
