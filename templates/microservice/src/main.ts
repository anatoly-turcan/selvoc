import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AuthGuard } from '@selvoc/nest-auth';
import { PinoLogger } from '@selvoc/nest-logger-pino';

import { AppModule } from './app.module';
import { AppConfig } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService<AppConfig, true>);
  const logger = app.get(PinoLogger);

  const port = config.get('port', { infer: true });
  const hostname = config.get('hostname', { infer: true });

  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));

  app.enableShutdownHooks();

  await app.listen(port, hostname);

  logger.info(`Listening on ${port} (${hostname})`);
}

bootstrap();
