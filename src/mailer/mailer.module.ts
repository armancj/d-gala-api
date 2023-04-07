import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as Mailer, MailerOptions } from '@nestjs-modules/mailer'; //npm install --save @nestjs-modules/mailer nodemailer
import { APP_CONFIG_EMAIL } from './config/emailConstant';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    Mailer.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [mailConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<MailerOptions>(APP_CONFIG_EMAIL),
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
