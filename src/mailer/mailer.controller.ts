import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailDto } from './dto/email.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('email')
  async sendEmailTest(@Body() email: EmailDto) {
    return await this.mailerService.sendMail(email);
  }
}
