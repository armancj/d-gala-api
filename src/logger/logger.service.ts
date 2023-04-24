import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerEnum } from './config/logger.const';
import { LoggerDto } from './dto/logger.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly _winstonLogger: WinstonLogger,
    private readonly prismaService: PrismaService,
  ) {}

  log(message: any, metadata?: any) {
    this.createLogger(LoggerEnum.http, message);
    return this._winstonLogger.log(message, metadata);
  }

  error(message: any, trace: string, metadata?: any) {
    this.createLogger(LoggerEnum.error, message);
    return this._winstonLogger.error(message, trace, metadata);
  }

  warn(message: any, metadata?: any) {
    this.createLogger(LoggerEnum.warn, message);
    return this._winstonLogger.warn(message, metadata);
  }

  private createLogger(logger: LoggerEnum, message: any): void {
    this.prismaService.logs
      .create({
        data: { statusLog: logger, ...message },
      })
      .catch((err) => console.log(err));
  }

  getLogger(loggerDto: LoggerDto) {
    const {
      searchMessage,
      skip,
      contentLength,
      statusLog,
      statusCode,
      take,
      method,
      toDate,
      fromDate,
    } = loggerDto;
    const where: Prisma.LogsWhereInput = {};

    if (searchMessage)
      where.statusMessage = {
        contains: searchMessage,
        mode: 'insensitive',
      };
    if (statusLog) where.statusLog = statusLog;
    if (contentLength) where.contentLength = contentLength;
    if (statusCode) where.statusCode = statusCode;
    if (method) where.method = method;

    if (fromDate) where.createdAt = { gte: fromDate };
    if (toDate) where.createdAt = { lte: toDate };

    return this.prismaService.logs.findMany({
      take,
      skip,
      where,
    });
  }
}
