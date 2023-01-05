import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger= new Logger(LoggerMiddleware.name)
  // @ts-ignore
  use(req: Request, res: Response, next: () => NextFunction) {
    console.log('Request...');
    next();
  }
}
