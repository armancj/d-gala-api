import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import e, { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(LoggerMiddleware.name);
  use({
    req,
    res,
    next,
  }: {
    req: e.Request;
    res: e.Response;
    next: () => e.NextFunction;
  }) {
    console.log('Request...');
    next();
  }
}
