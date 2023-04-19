import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post, Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './authentication/guard';
import { AuthService } from './authentication/auth.service';
import { GetUser, Public } from './authentication/decorator';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterUserDto,
} from './authentication/dto';
import { UserPayload } from './user/interface/user-payload';
import { JwtRefreshAuthGuard } from './authentication/guard/jwt-refresh-auth.guard';
import { LoggerService } from './logger/logger.service';

@ApiTags('App')
@Controller({ version: '1' })
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Public()
  getHello(@Req() req: Request): string {
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
