import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerServices: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const { statusMessage, statusCode } = res;
      const contentLength = res.get('content-length');
      const message = {
        method,
        originalUrl,
        params: req?.params,
        statusCode,
        statusMessage,
        user: req?.user,
        contentLength,
      };

      if (statusCode >= 500) {
        return this.loggerServices.error(message, req.path);
      }

      if (statusCode >= 400) {
        return this.loggerServices.warn(message);
      }

      return this.loggerServices.log(message);
    });

    next();
  }
}
