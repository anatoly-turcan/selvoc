import { Inject, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';

import { EventClient, EventClientParams } from '@bobo/event-client';

import { MODULE_OPTIONS_TOKEN } from './module-definition';

export class NestEventClient
  extends EventClient
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: EventClientParams) {
    super(options);
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.init();
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.close();
  }
}
