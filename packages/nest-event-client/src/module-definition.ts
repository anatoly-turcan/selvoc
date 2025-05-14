import { ConfigurableModuleBuilder } from '@nestjs/common';

import { EventClientParams } from '@selvoc/event-client';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<EventClientParams>().setClassMethodName('forRoot').build();
