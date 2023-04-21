import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { WinstonModule } from 'nest-winston';
import { WinstonOptionsProvider } from './config/winston-Options.provider';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: WinstonOptionsProvider,
    }),
  ],
  controllers: [LoggerController],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
