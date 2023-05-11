import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Public } from '../auth/decorator';
import { LoggerDto } from './dto/logger.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Logs')
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Public()
  @Get()
  getLogger(@Query() loggerDto: LoggerDto) {
    return this.loggerService.getLogger(loggerDto);
  }
}
