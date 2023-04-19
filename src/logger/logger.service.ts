import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import {
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';

//import { LoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly winstonLogger: Logger,
  ) {}
  log(level: string, message: any, metadata?: any) {
    this.winstonLogger.log(level, message, metadata);
  }

  error(message: string, trace: string, metadata?: any) {
    this.winstonLogger.error(message, { trace, metadata });
  }

  warn(message: string, metadata?: any) {
    this.winstonLogger.warn(message, metadata);
  }

  info(message: string, metadata?: any) {
    this.winstonLogger.info(message, metadata);
  }

  debug(message: string, metadata?: any) {
    this.winstonLogger.debug(message, metadata);
  }

  verbose(message: string, metadata?: any) {
    this.winstonLogger.verbose(message, metadata);
  }
}
