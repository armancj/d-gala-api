import { Prisma } from '@prisma/client';
import { EnumPrismaError } from './prisma-error.enum';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export function HandlerError(error: any, message?: string) {
  const logger = new Logger(HandlerError.name);
  logger.error(`${error.message}, code: ${error.code} `);
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // The .code property can be accessed in a type-safe manner
    if (error.code === EnumPrismaError.UniqueConstraintViolation) {
      throw new ConflictException(message);
    }

    if (error.code === EnumPrismaError.ForeignKeyConstraintFailed) {
      throw new BadRequestException(message);
    }

    if (error.code === EnumPrismaError.NOT_FOUND)
      throw new NotFoundException(message);

    throw new InternalServerErrorException(
      `Prisma error: ${error.message}, code:${error.code}`,
    );
  }
  throw new HttpException(
    error.message,
    error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
