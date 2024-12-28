import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './module-definition';
import { PinoLogger } from './pino-logger';

@Global()
@Module({
  providers: [PinoLogger],
  exports: [PinoLogger],
})
export class NestPinoLoggerModule extends ConfigurableModuleClass {}
