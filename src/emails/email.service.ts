import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';
import { User } from 'src/user/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendCode(user: Partial<User>) {
    try {
      await this.mailerService.sendMail({
        to: user.email!,
        subject: 'Código de verificación',
        template: 'codeVerified.hbs',
        context: {
          name: `${user.name ?? ''} ${user.lastName ?? ''}`,
          code: user.code,
          expiresIn: '30',
          supportEmail: 'correo@correo.com',
          year: dayjs().format('YYYY'),
          logoUrl:
            'https://images.unsplash.com/photo-1618056210931-39f730ebbf67?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
