import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  public resend: Resend;
  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('resend.apiKey'));
  }


  async sendEmail(to: string, subject: string, body: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.configService.get('resend.emailSender')!,
        to: [to],
        subject: subject,
        html: body,
      });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (e) {
      console.log('ERROR RESEND: ', e.message);
      throw new Error(e.message);
    }
  }
}