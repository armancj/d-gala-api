import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard, JwtAuthGuard } from './authentication/guard';
import { AuthService } from './authentication/auth.service';
import { Public, GetUser } from './authentication/decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@GetUser() user) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user) {
    return user;
  }
}
