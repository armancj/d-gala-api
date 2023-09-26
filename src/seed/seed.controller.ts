import { Controller, Delete, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, Public } from '../auth/decorator';
import { ApiTags } from '@nestjs/swagger';
import { EnumUserRole } from '../user/enum/user-role.enum';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  //@Auth(EnumUserRole.SUADMIN)
  @Public()
  @Post()
  executeSeed() {
    return this.seedService.executeSeed();
  }

  //@Auth(EnumUserRole.SUADMIN)
  @Public()
  @Delete()
  clearSeed() {
    return this.seedService.deleteAllDataDb();
  }
}
