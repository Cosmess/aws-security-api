import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
  logger:["log","verbose","debug","warn","error"]
  });

  // Middleware para obter o IP do cliente
  app.use(requestIp.mw());

  await app.listen(3000);
}
bootstrap();
