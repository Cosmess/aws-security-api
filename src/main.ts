import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
  logger:["log","verbose","debug","warn","error"]
  });

  app.use(requestIp.mw());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,POST',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
