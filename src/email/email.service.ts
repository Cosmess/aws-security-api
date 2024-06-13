import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(email: string, code: string) {
    const msg = {
      to: email,
      from: 'contato@payhop.com.br',
      subject: 'Código de Verificação',
      text: `Seu código de verificação é ${code}. Ele expira em 5 minutos.`,
      html: `<strong>Seu código de verificação é ${code}. Ele expira em 5 minutos.</strong>`,
    };

    await sgMail.send(msg);
  }
}
