import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/guard';
import { AuthService } from './auth/auth.service';
import { GetUser, Public } from './auth/decorator';
import { LoginDto, RefreshTokenDto, RegisterUserDto } from './auth/dto';
import { UserPayload } from './user/interface/user-payload';
import { JwtRefreshAuthGuard } from './auth/guard/jwt-refresh-auth.guard';

@ApiTags('App')
@Controller({ version: '1' })
export class AppController {
  constructor(private authService: AuthService) {}

  @Get()
  @Public()
  getHello() {
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

  @Public()
  @Post('auth/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('auth/register_init')
  async registerCpanel(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerInit(registerUserDto);
  }

  @Public()
  @ApiBody({ type: RefreshTokenDto })
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refresh(@GetUser() user: UserPayload) {
    return this.authService.login(user);
  }
}
