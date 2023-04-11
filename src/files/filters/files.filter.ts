import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class FilesFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpStatus = exception?.getStatus();
    const exceptionResponse = exception.getResponse();
    let error;

    if (httpStatus < HttpStatus.INTERNAL_SERVER_ERROR) {
      error =
        typeof response === 'string'
          ? { message: [exceptionResponse] }
          : (exceptionResponse as object);
      if (error.message.includes('Unexpected field'))
        error = {
          statusCode: httpStatus,
          message: ['Maximum file count exceeded'],
        };
    } else {
      error = { statusCode: httpStatus, message: [exception.message] };
    }

    response.status(httpStatus).json({
      ...error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
