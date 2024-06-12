import { Controller, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AccessService } from '../services/access.service';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post()
  async updateAccessRule(
    @Body('ruleDescription') ruleDescription: string,
    @Body('ip') ip: string,
    @Body('userId') userId: number,
    @Body('typeGroup') typeGroup: string,
    @Body('typeService') typeService: string,
    @Req() request: Request
  ) {
    const newIp = ip || request.ip;
    try {
      const access = await this.accessService.revokeAndAddIngressRuleByDescription(ruleDescription, newIp, userId, typeGroup, typeService);
      return access;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
