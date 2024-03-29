import { registerAs } from '@nestjs/config';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as process from 'process';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
export default registerAs('email', async (): Promise<MailerOptions> => {
  return {
    transport: {
      service: `${process.env.EMAIL_SERVICE}`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
      tls: {
        // do not fail on invalid certs
        minVersion: 'TLSv1',
        rejectUnauthorized: false,
      },
    },
    defaults: {
      from: `${process.env.FROM} <${process.env.FROM_EMAIL}>`,
    },
    template: {
      dir: path.join(__dirname, '../template'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
});
