import 'dotenv/config';

import { amqpEventsConfig, AmqpEventsConfig } from './event.amqp.config';
import { memoryEventsConfig, MemoryEventsConfig } from './event.memory.config';
import { KeycloakConfig, keycloakConfig } from './keycloak.config';
import { typeormConfig, TypeormConfig } from './typeorm.config';

export type CommonConfig = {
  typeorm: TypeormConfig;
  keycloak: KeycloakConfig;
  events: {
    amqp: AmqpEventsConfig;
    memory: MemoryEventsConfig;
  };
};

export function loadCommonConfig(): CommonConfig {
  return {
    typeorm: typeormConfig,
    keycloak: keycloakConfig,
    events: {
      amqp: amqpEventsConfig,
      memory: memoryEventsConfig,
    },
  };
}
