import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../authentication/decorator';
import { EmailDto } from './dto/email.dto';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post()
  testEmail(@Body() emailDto: EmailDto) {
    return this.emailService.sendMail(emailDto);
  }
}
