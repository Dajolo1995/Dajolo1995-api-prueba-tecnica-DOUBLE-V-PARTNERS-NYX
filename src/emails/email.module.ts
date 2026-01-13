import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigType } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';
import { EmailService } from './email.service';
import config from 'src/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { host, password, port, secure, user } = configService.nodemailer;

        const candidates = [
          join(__dirname, 'template'),
          join(process.cwd(), 'dist', 'emails', 'template'),
          join(process.cwd(), 'src', 'emails', 'template'),
        ];
        const templateFile = 'codeVerified.hbs';
        const templateDir = candidates.find((p) =>
          existsSync(join(p, templateFile)),
        );
        if (!templateDir) {
          throw new Error(
            `No se encontró ${templateFile} en: ${candidates.join(' | ')}`,
          );
        }

        return {
          transport: {
            host,
            secure: secure === 'true',
            port: parseInt(port as any),
            requireTLS: true,
            auth: {
              user,
              pass: password,
            },
          },

          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}