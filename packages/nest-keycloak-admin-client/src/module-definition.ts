import { ConfigurableModuleBuilder } from '@nestjs/common';

import { KeycloakAdminClientModuleOptions } from './types';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KeycloakAdminClientModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
