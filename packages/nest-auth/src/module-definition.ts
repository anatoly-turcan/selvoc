import { ConfigurableModuleBuilder } from '@nestjs/common';

import { KeycloakJwksStrategyOptions } from './keycloak-jwks.strategy';

export type AuthModuleOptions = KeycloakJwksStrategyOptions;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthModuleOptions>().setClassMethodName('forRoot').build();
