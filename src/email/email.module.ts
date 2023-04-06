import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mailConfig],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
