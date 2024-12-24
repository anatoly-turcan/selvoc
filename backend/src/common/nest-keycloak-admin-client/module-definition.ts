import { ConfigurableModuleBuilder } from '@nestjs/common';

import { NestKeycloakAdminClientModuleOptions } from './types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<NestKeycloakAdminClientModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
