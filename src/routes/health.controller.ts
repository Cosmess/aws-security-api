import { Controller, Get } from '@nestjs/common';
import { integer } from 'aws-sdk/clients/cloudfront';

@Controller('health')
export class HealthController {
 constructor() {}

 @Get()
 healthCheck(): { status: string, code: integer} {
  return { status: 'Server running', code: 200 };
 }
}