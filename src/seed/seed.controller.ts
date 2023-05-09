import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../authentication/decorator';
import { ApiTags } from '@nestjs/swagger';
import { EnumUserRole } from '../user/enum/user-role.enum';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Auth(EnumUserRole.SUADMIN)
  @Get()
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
