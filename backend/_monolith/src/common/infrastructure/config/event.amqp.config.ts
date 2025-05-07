import { AmqpEventTransportConfig } from '@bobo/event-client-transport-amqp';
import {
  UserCreatedAdminKeycloakEvent,
  UserRegisteredKeycloakEvent,
  UserUpdatedAdminKeycloakEvent,
} from '@bobo/events';
import { get } from 'env-var';

import { keycloakConfig } from './keycloak.config';

export type AmqpEventsConfig = AmqpEventTransportConfig;

const queueName = get('USER_AMQP_QUEUE_NAME').default('user-service').asString();
const keycloakExchangeName = get('USER_AMQP_KEYCLOAK_EXCHANGE_NAME')
  .default('keycloak.topic')
  .asString();

export const amqpEventsConfig: AmqpEventsConfig = {
  connections: [
    {
      connection: {
        protocol: get('AMQP_PROTOCOL').required().asString(),
        hostname: get('AMQP_HOSTNAME').required().asString(),
        username: get('AMQP_USERNAME').required().asString(),
        password: get('AMQP_PASSWORD').required().asString(),
        port: get('AMQP_PORT').required().asPortNumber(),
      },
      definitions: {
        queues: [{ name: queueName, durable: true }],
      },
      consumers: [
        {
          queue: queueName,
          eventBindings: [
            {
              exchange: keycloakExchangeName,
              events: [
                {
                  event: UserCreatedAdminKeycloakEvent,
                  routingKey: UserCreatedAdminKeycloakEvent.getRouteKey(keycloakConfig.realm),
                },
                {
                  event: UserUpdatedAdminKeycloakEvent,
                  routingKey: `KK.EVENT.ADMIN.${keycloakConfig.realm}.SUCCESS.USER.UPDATE`,
                },
                {
                  event: UserRegisteredKeycloakEvent,
                  routingKey: `KK.EVENT.CLIENT.${keycloakConfig.realm}.SUCCESS.*.REGISTER`,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
