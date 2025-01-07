import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AuthGuard } from '@common/nest-auth';
import { PinoLogger } from '@common/nest-logger-pino';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(PinoLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalGuards(new AuthGuard());

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
