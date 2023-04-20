import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger.service';
import { User } from '@prisma/client';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerServices: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const { statusMessage, statusCode } = res;
      const contentLength = res.get('content-length');
      const metadata = {
        user: (req?.user as User)?.id,
        params: req?.params,
      };
      const message: string = {
        metadata,
        contentLength,
        method,
        originalUrl,
        statusCode,
        statusMessage,
      } as unknown as string;

      if (statusCode >= 500) {
        return this.loggerServices.error(message, req.path, metadata);
      }

      if (statusCode >= 400) {
        return this.loggerServices.warn(message, metadata);
      }

      return this.loggerServices.log('log', message, metadata);
    });

    next();
  }
}
