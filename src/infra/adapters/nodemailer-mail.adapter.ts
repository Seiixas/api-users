import * as nodemailer from 'nodemailer';

import { MailPort } from '@/core/ports/mail.port';
import { Env } from '@/shared/env';

export class NodemailerMailAdapter implements MailPort {
  constructor(private readonly transporter: nodemailer.Transporter) {}

  sendMail(mail: { to: string; subject: string; body: string }) {
    this.transporter.sendMail({
      from: Env.MAIL_FROM,
      to: mail.to,
      subject: mail.subject,
      html: mail.body,
    });
  }
}
