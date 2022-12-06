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
import { GetUser, Public } from './authentication/decorator';
import { LoginDto, RegisterUserDto } from './authentication/dto';
import { UserPayload } from './user/interface/user-payload';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  //@Roles(EnumUserRole.ADMIN)
  @Public()
  @Get()
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

  @Public()
  @Post('auth/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
