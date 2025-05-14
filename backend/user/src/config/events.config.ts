import { RabbitMqEventTransportConfig } from '@bobo/event-client-transport-rabbitmq';
import {
  UserCreatedAdminKeycloakEvent,
  UserRegisteredKeycloakEvent,
  UserUpdatedAdminKeycloakEvent,
} from '@bobo/events';
import { get } from 'env-var';

import { keycloakConfig } from './keycloak.config';

export type EventsConfig = {
  rabbitmq: RabbitMqEventTransportConfig;
};

const QUEUE_NAME = get('RABBITMQ_QUEUE_NAME').default('user-service').asString();
const KEYCLOAK_EXCHANGE_NAME = get('RABBITMQ_KEYCLOAK_EXCHANGE_NAME')
  .default('keycloak.topic')
  .asString();

export const eventsConfig: EventsConfig = {
  rabbitmq: {
    connections: [
      {
        connection: {
          protocol: get('RABBITMQ_PROTOCOL').required().asString(),
          hostname: get('RABBITMQ_HOSTNAME').required().asString(),
          username: get('RABBITMQ_USERNAME').required().asString(),
          password: get('RABBITMQ_PASSWORD').required().asString(),
          port: get('RABBITMQ_PORT').required().asPortNumber(),
        },
        definitions: {
          queues: [{ name: QUEUE_NAME, durable: true }],
        },
        consumers: [
          {
            queue: QUEUE_NAME,
            eventBindings: [
              {
                exchange: KEYCLOAK_EXCHANGE_NAME,
                events: [
                  {
                    event: UserCreatedAdminKeycloakEvent,
                    routingKey: UserCreatedAdminKeycloakEvent.getRouteKey(keycloakConfig.realm),
                  },
                  {
                    event: UserUpdatedAdminKeycloakEvent,
                    routingKey: UserUpdatedAdminKeycloakEvent.getRouteKey(keycloakConfig.realm),
                  },
                  {
                    event: UserRegisteredKeycloakEvent,
                    routingKey: UserRegisteredKeycloakEvent.getRouteKey(keycloakConfig.realm),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
