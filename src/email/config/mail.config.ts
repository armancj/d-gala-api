import { registerAs } from '@nestjs/config';
import * as path from 'path';
import { Auth, google } from 'googleapis';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export default registerAs('email', async () => {
  const oauth2Client: Auth.OAuth2Client = new google.auth.OAuth2(
    `${process.env.EMAIL_CLIENT_ID}`,
    `${process.env.EMAIL_SECRET_KEY}`,
    `${process.env.EMAIL_REDIRECT_UI}`,
  );

  oauth2Client.setCredentials({
    refresh_token: `${process.env.EMAIL_REFRESH_TOKEN}`,
  });
  return {
    transport: {
      service: `${process.env.EMAIL_SERVICE}`,
      auth: {
        type: `${process.env.EMAIL_TYPE}`,
        user: `${process.env.EMAIL_USER}`,
        clientId: `${process.env.EMAIL_CLIENT_ID}`,
        clientSecret: `${process.env.EMAIL_SECRET_KEY}`,
        refreshToken: `${process.env.EMAIL_REFRESH_TOKEN}`,
        accessToken: await oauth2Client
          .getAccessToken()
          .then((r) => r.token)
          .catch((e) => {
            console.log(e.message);
            return '';
          }),
      },
      tls: {
        // do not fail on invalid certs
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
