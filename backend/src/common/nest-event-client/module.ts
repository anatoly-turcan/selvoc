import { Module } from '@nestjs/common';

import { EventClient } from '@common/event-client';

import { ConfigurableModuleClass } from './module-definition';
import { NestEventClient } from './nest-event-client';

@Module({
  providers: [{ provide: EventClient, useClass: NestEventClient }],
  exports: [EventClient],
})
export class NestEventClientModule extends ConfigurableModuleClass {}
