import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailDto } from './dto/email.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../authentication/decorator';
import { EnumUserRole } from '../user/enum/user-role.enum';

@ApiTags('Email')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Auth(EnumUserRole.SUADMIN)
  @Post('email')
  async sendEmailTest(@Body() email: EmailDto) {
    return await this.mailerService.sendMail(email);
  }
}
