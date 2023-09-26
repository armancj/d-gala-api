import { Prisma } from '@prisma/client';
import { EnumPrismaError } from './prisma-error.enum';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function HandlerError(error: any, message?: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorMessage = message ? message : error?.meta?.cause;

    if (error.code === EnumPrismaError.UniqueConstraintViolation) {
      throw new ConflictException(errorMessage);
    }

    if (error.code === EnumPrismaError.ForeignKeyConstraintFailed) {
      throw new BadRequestException(errorMessage);
    }

    if (error.code === EnumPrismaError.NOT_FOUND)
      throw new NotFoundException(errorMessage);

    throw new InternalServerErrorException(
      `Prisma error: ${error?.meta}, code:${error.code}`,
    );
  }
    console.log({ error, message });
  throw new HttpException(
    error.message,
    error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
