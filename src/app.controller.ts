import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './authentication/guard';
import { AuthService } from './authentication/auth.service';
import { Auth, GetUser, Public } from './authentication/decorator';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterUserDto,
} from './authentication/dto';
import { UserPayload } from './user/interface/user-payload';
import { EnumUserRole } from './user/enum/user-role.enum';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get()
  @Public()
  getHello(): string {
    return 'Hello World!';
  }

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: LoginDto })
  async login(@GetUser() user: UserPayload) {
    return this.authService.login(user);
  }

  @Post('auth/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
  @Auth(
    EnumUserRole.ADMIN,
    EnumUserRole.SUADMIN,
    EnumUserRole.WORKER,
    EnumUserRole.USER,
  )
  @ApiBody({ type: RefreshTokenDto })
  @Get('refresh')
  refresh(@GetUser() user: UserPayload, @Body() refresh: RefreshTokenDto) {
    this.authService
      .getUserIfRefreshTokenMatches(refresh.refresh_token, user.id)
      .catch((err) => {
        console.log(err);
      });
    return this.authService.login(user);
  }
}
