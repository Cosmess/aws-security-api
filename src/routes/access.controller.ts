import { Controller, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AccessService } from '../services/access.service';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('send-code')
  async sendVerificationCode(@Body('email') email: string) {
    try {
      await this.accessService.sendVerificationCode(email);
      return { message: 'Código de verificação enviado' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify')
  async updateAccessRule(
    @Body('ruleDescription') ruleDescription: string,
    @Body('ip') ip: string,
    @Body('email') email: string,
    @Body('verificationCode') verificationCode: string,
    @Body('typeGroup') typeGroup: string,
    @Body('typeService') typeService: string,
    @Req() request: Request
  ) {
    const newIp = ip || request.ip;
    try {
      const access = await this.accessService.revokeAndAddIngressRuleByDescription(ruleDescription, newIp, verificationCode, typeGroup, typeService);
      return access;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
