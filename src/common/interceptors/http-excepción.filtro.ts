import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpStatus = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let error;
    if (httpStatus < HttpStatus.INTERNAL_SERVER_ERROR) {
      error =
        typeof response === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as object);
      this.logger.warn(exception, exception.name);
    } else {
      error = { statusCode: httpStatus, message: exception.message };
      this.logger.error(exception, exception.stack, exception.name);
    }

    response.status(httpStatus).json({
      ...error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
