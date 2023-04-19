import {
  ExecutionContext,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerServices: LoggerService) {}

  private logger: Logger = new Logger(LoggerMiddleware.name);
  use({
    req,
    res,
    next,
  }: {
    req: Request;
    res: Response;
    next: () => NextFunction;
  }) {
    console.log(req);
    const { statusCode, statusMessage } = res;
    const { method } = req;
    const contentLength = res.get('content-length');

    const message = { method, statusCode };

    this.loggerServices.log('info', message);

    next();
  }
}
