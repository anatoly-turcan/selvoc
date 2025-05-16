import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
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

  app.enableShutdownHooks();

  await app.listen(port, hostname);

  logger.info(`Listening on ${hostname}:${port}`);
}

bootstrap();
