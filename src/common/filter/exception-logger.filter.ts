import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ExceptionLoggerFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
    super.catch(exception, host);
  }
}
