import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerServices: LoggerService) {}

  private logger: Logger = new Logger(LoggerMiddleware.name);
  async use({
    req,
    res,
    next,
  }: {
    req: Request;
    res: Response;
    next: () => NextFunction;
  }) {
    const { statusCode, statusMessage } = res;
    const contentLength = res.get('content-length');


    console.log(req)

    const message = `${res.req?.method} ${res.req?.originalUrl} ${statusCode}`;

    this.loggerServices.log('info', message);

    next();
  }
}
