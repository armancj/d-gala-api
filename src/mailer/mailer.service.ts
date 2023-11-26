import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ISendMailOptions,
  MailerService as EmailService,
} from '@nestjs-modules/mailer';
import { FROM_EMAIL } from './config/emailConstant';

@Injectable()
export class MailerService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    private readonly mailerService: EmailService,
  ) {}

  async testSendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  async sendMail(params: ISendMailOptions) {
    const { subject, to, html, text, template, context } = params;

    //const result = new CustomResult();
    const data: ISendMailOptions = {
      to, //patient email
      from: this.config.get<string>(FROM_EMAIL),
      subject,
      template,
      html,
      text,
      context,
    };

    return this.mailerService
      .sendMail(data)
      .then(() => {
        return { message: 'Send successfully' };
      })
      .catch((error) => {
        throw new HttpException(`Send failed: ${error.message}`, error.status);
      });
  }
}
