import 'dotenv/config';

import { get } from 'env-var';

import { authConfig, AuthConfig } from './auth.config';
import { KeycloakConfig, keycloakConfig } from './keycloak.config';
import { LoggerConfig, loggerConfig } from './logger.config';
import { typeormConfig, TypeormConfig } from './typeorm.config';

export type AppConfig = {
  port: number;
  hostname: string;
  typeorm: TypeormConfig;
  keycloak: KeycloakConfig;
  logger: LoggerConfig;
  auth: AuthConfig;
};

export function loadAppConfig(): AppConfig {
  return {
    port: get('PORT').default('3000').asInt(),
    hostname: get('HOSTNAME').default('::').asString(),
    typeorm: typeormConfig,
    keycloak: keycloakConfig,
    logger: loggerConfig,
    auth: authConfig,
  };
}
