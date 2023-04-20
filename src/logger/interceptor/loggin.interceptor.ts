import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('Before...');
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const { method, originalUrl } = request;
    const message = `${method} ${originalUrl}`;

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(message);
        this.logger.log(`After... ${Date.now() - now}ms`);
      }),
    );
  }
}
