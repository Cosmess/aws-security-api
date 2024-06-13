import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

interface Verification {
  email: string;
  code: string;
  expiration: Date;
}

@Injectable()
export class VerificationService {
  private verifications: Verification[] = [];

  generateVerificationCode(email: string): string {
    const code = uuidv4();
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 5);

    this.verifications.push({ email, code, expiration });
    return code;
  }

  verifyCode(email: string, code: string): boolean {
    const verification = this.verifications.find(
      (v) => v.email === email && v.code === code,
    );

    if (!verification) {
      throw new HttpException('Código de verificação inválido', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > verification.expiration) {
      this.verifications = this.verifications.filter((v) => v !== verification);
      throw new HttpException('Código de verificação expirado', HttpStatus.BAD_REQUEST);
    }

    this.verifications = this.verifications.filter((v) => v !== verification);
    return true;
  }

  @Cron('*/1 * * * *')
  handleCron() {
    const now = new Date();
    this.verifications = this.verifications.filter(
      (verification) => verification.expiration > now,
    );
  }
}
