import { Global, Module } from '@nestjs/common';

import { EventClient } from '@common/event-client';

import { ConfigurableModuleClass } from './module-definition';
import { NestEventClient } from './nest-event-client';

@Global()
@Module({
  providers: [{ provide: EventClient, useClass: NestEventClient }],
  exports: [EventClient],
})
export class NestEventClientModule extends ConfigurableModuleClass {}
