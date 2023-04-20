import { ArgumentsHost, Catch, Logger, ExceptionFilter } from '@nestjs/common';

@Catch()
export class ExceptionLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionLoggerFilter.name);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
  }
}
