import { Injectable } from '@nestjs/common';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston/dist/winston.interfaces';
import { levels } from './logger.const';
import * as winston from 'winston';

@Injectable()
export class WinstonOptionsProvider implements WinstonModuleOptionsFactory {
  createWinstonModuleOptions():
    | Promise<WinstonModuleOptions>
    | WinstonModuleOptions {
    return {
      levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.ms(),
        winston.format.simple(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/warn.log',
          level: 'warn',
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'http',
        }),
      ],
    };
  }
}
