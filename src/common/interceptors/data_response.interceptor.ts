import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { IS_EXCLUDE_KEY } from '../../files/decorators/exclude-interceptor.decorator';

export interface Response<T> {
  data: T;
}

@Injectable()
export class DataResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const isExclude = this.reflector.getAllAndOverride<boolean>(
      IS_EXCLUDE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isExclude) {
      return next.handle();
    }
    return next.handle().pipe(map((data) => ({ data })));
  }
}
