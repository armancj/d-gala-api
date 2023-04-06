import { Inject, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { CustomResult } from '../common/dto/commonResult.dto';
import { ConfigService } from '@nestjs/config';
import { FROM_EMAIL } from '../config/constants';

@Injectable()
export class EmailService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async testSendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  async sendMail(params: {
    subject?: string;
    to?: string;
    text?: string;
    html?: string;
    template?: string;
    context?: {
      body?: string;
      name?: string;
      link?: string;
    };
  }): Promise<CustomResult | void> {
    const { subject, to, html, text, template, context } = params;

    const result = new CustomResult();
    const data: ISendMailOptions = {
      to, //patient email
      from: this.config.get<string>(FROM_EMAIL),
      subject,
      template,
      html,
      text,
      context,
    };

    this.mailerService
      .sendMail(data)
      .then((resultMessage) => {
        result.successfully = true;
        result.result = resultMessage;
        return result;
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        result.successfully = false;
        result.message = error.message;
        return result;
      });
  }
}
