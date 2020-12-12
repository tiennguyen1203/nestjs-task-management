import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const serverConfig = config.get('server');
  const app = await NestFactory.create(AppModule);

  // if (process.env.NODE_ENV === 'development') {
  // }
  app.enableCors();

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}
bootstrap();
