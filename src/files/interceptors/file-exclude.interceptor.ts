import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class FileExcludeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(next.handle());
    /*  const isCached = true;
    if (isCached) {
      return of([]);
    }*/
    return next.handle();
  }
}
