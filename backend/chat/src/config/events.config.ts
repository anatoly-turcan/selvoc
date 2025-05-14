import { RabbitMqEventTransportConfig } from '@bobo/event-client-transport-rabbitmq';
import { get } from 'env-var';

import { ChatMemberJoinedEvent, ChatMessageCreatedEvent } from '@modules/chat/domain/events';

export type EventsConfig = {
  rabbitmq: RabbitMqEventTransportConfig;
};

const QUEUE_NAME = get('RABBITMQ_QUEUE_NAME').default('chat-service').asString();
const EXCHANGE_NAME = get('RABBITMQ_EXCHANGE_NAME').default('chat.topic').asString();

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
          exchanges: [{ name: EXCHANGE_NAME, type: 'topic', durable: true }],
          queues: [{ name: QUEUE_NAME, durable: true }],
        },
        producers: [
          { exchange: EXCHANGE_NAME, events: [ChatMessageCreatedEvent, ChatMemberJoinedEvent] },
        ],
        consumers: [
          {
            queue: QUEUE_NAME,
            eventBindings: [
              {
                exchange: EXCHANGE_NAME,
                events: [ChatMessageCreatedEvent],
              },
            ],
          },
        ],
      },
    ],
  },
};
