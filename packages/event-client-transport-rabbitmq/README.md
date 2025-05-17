# RabbitMQ Transport

A RabbitMQ transport for use with [`@selvoc/event-client`](../event-client/README.md).

## Installation

```bash
npm install @selvoc/event-client-transport-rabbitmq
```

> **Note:** You also need to install and configure [`@selvoc/event-client`](../event-client/README.md) in your project.

## Usage

See the [@selvoc/event-client README](../event-client/README.md) for general setup, event definitions, and basic usage.

### Configuring

```typescript
import { RabbitMqEventTransport } from '@selvoc/event-client-transport-rabbitmq';
import { EventClient } from '@selvoc/event-client';

import { UserCreatedEvent } from './events/user-created.event';

const rabbitConfig = {
  connections: [
    {
      connection: {
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: 'guest',
        password: 'guest',
      },
      definitions: { // optional. define exchanges and queues
        exchanges: [
          { name: 'user.topic', type: 'topic', durable: true },
        ],
        queues: [
          { name: 'user-service', durable: true },
        ],
      },
      consumers: [ // optional. consume events from this queue
        {
          queue: 'user-service',
          eventBindings: [
            {
              exchange: 'user.topic', // exchange to bind to
              events: [UserCreatedEvent], // which events to consume
            },
          ],
        },
      ],
      producers: [ // optional. publish events to this exchange
        {
          exchange: 'user.topic',
          events: [UserCreatedEvent], // which events to publish
        },
      ],
    },
  ],
};

const eventClient = new EventClient({
  transports: [new RabbitMqEventTransport(rabbitConfig)],
  logger: console,
});

await eventClient.init();
```

## Key Concepts

- **Event bindings**: Map events to exchanges and queues.
- **Producers/consumers**: You can configure multiple producers and consumers per connection.
- **Exchanges/queues**: Use RabbitMQ's flexible routing and durability features.

## Advanced Configuration

You can use routing keys, multiple exchanges, and advanced RabbitMQ features.
See the TypeScript types in the source code for all options.

## Planned Features

- `@RabbitListener` method decorator for more complex and ergonomic event handler setup
- Fine-grained control over ack/nack for message processing
- Ability to generate a dedicated queue per listener
- Dead letter queue support
- And more
