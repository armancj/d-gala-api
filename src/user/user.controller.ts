import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GetAllQueryDto, GetAllResponseDto } from '../common/dto';
import { UserResponse } from './interface/user.response';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { Auth, GetUser } from '../authentication/decorator';
import { EnumUserRole } from './enum/user-role.enum';
import { UserPayload } from './interface/user-payload';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('User')
@Controller('user')
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

  @Get()
  @ApiOkResponse({ type: GetAllResponseDto })
  findAllUser(@Query() query: GetAllQueryDto) {
    return this.userService.findAll({ skip: +query?.skip, take: +query?.take });
  }

  @Get('profile')
  getProfile(@GetUser() user: UserPayload) {
    return this.userService.findOne(+user.id);
  }
  @Get(':id')
  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN)
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Patch('update-profile')
  updateProfile(
    @GetUser() user: UserPayload,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfileUser(user, updateUserProfileDto);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
