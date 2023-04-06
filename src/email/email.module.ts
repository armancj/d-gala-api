import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mailConfig from './config/mail.config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import {EmailConstant} from "./config/email.constant";
import { EmailController } from './email.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mailConfig],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<MailerOptions>(EmailConstant),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
