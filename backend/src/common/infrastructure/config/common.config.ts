import 'dotenv/config';

import { amqpEventsConfig, AmqpEventsConfig } from './event.amqp.config';
import { memoryEventsConfig, MemoryEventsConfig } from './event.memory.config';
import { KeycloakConfig, keycloakConfig } from './keycloak.config';
import { LoggerConfig, loggerConfig } from './logger.config';
import { typeormConfig, TypeormConfig } from './typeorm.config';

export type CommonConfig = {
  typeorm: TypeormConfig;
  keycloak: KeycloakConfig;
  logger: LoggerConfig;
  events: {
    amqp: AmqpEventsConfig;
    memory: MemoryEventsConfig;
  };
};

export function loadCommonConfig(): CommonConfig {
  return {
    typeorm: typeormConfig,
    keycloak: keycloakConfig,
    logger: loggerConfig,
    events: {
      amqp: amqpEventsConfig,
      memory: memoryEventsConfig,
    },
  };
}
