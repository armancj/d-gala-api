import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/guard';
import { AuthService } from './auth/auth.service';
import { GetUser, Public } from './auth/decorator';
import { LoginDto, RefreshTokenDto, RegisterUserDto } from './auth/dto';
import { UserPayload } from './user/interface/user-payload';
import { JwtRefreshAuthGuard } from './auth/guard/jwt-refresh-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Products } from './store/products/entities/product.entity';
import { SearchServiceInsert } from './store/search/search.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('App')
@Controller({ version: '1' })
export class AppController {
  constructor(
    private authService: AuthService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @Public()
  async getHello() {
    const product: Products = {
      colorDefault: '',
      component: [],
      content: '',
      createdAt: undefined,
      deleted: false,
      gender: undefined,
      id: 21,
      name: '',
      price: 0,
      priceCut: 0,
      reviewsTotal: 0,
      sizes: [],
      slug: '',
      stars: 0,
      status: undefined,
      stock: 0,
      tags: [],
      updatedAt: undefined,
      userId: 0,
      viewCount: 0,
    };
    const searchServiceInsert: SearchServiceInsert = {
      index: 'product',
      product,
    };
    this.eventEmitter.emit('index.created', searchServiceInsert);

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
  @Post('auth/registerInit')
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
