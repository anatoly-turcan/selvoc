# Event Client

An experimental TypeScript library for event-driven communication in microservices.
This is not production-ready and is likely to change significantly in the future.

This library provides a simple, object-oriented approach to event-driven systems, using decorators for event definition and handling.
It aims to make event publishing and consumption type-safe and ergonomic, but is still in early development and may have breaking changes.

## Features

- Pluggable transports (see [`@selvoc/event-client-transport-basic`](../event-client-transport-basic) and [`@selvoc/event-client-transport-rabbitmq`](../event-client-transport-rabbitmq))
- Event validation with [`class-validator`](https://github.com/typestack/class-validator) and transformation with [`class-transformer`](https://github.com/typestack/class-transformer)
- Custom event classes with decorators
- Decorator-based event handling (no manual registration)
- Event producing
- Type-safe event payloads

## Installation

```bash
npm install @selvoc/event-client @selvoc/event-client-transport-basic class-validator reflect-metadata
```

> **Peer dependencies:** `class-validator`, `class-transformer`, and `reflect-metadata` must be installed.

## Usage

### Defining an Event

```typescript
import { Event } from '@selvoc/event-client';
import { IsString } from 'class-validator';

@Event('user.created')
export class UserCreatedEvent {
  @IsString()
  userId: string;

  static build(userId: string): UserCreatedEvent {
    const event = new UserCreatedEvent();
    event.userId = userId;

    return event;
  }
}
```

> **Note:** Do not use a constructor with parameters in your event classes.
> Due to how `class-transformer` works, it does not pass parameters to the constructor when deserializing.
> Use a static `build` method instead. This may improve in the future.

### Setting up the Event Client

```typescript
import 'reflect-metadata';
import { EventClient } from '@selvoc/event-client';
import { BasicEventTransport } from '@selvoc/event-client-transport-basic';
import { UserCreatedEvent } from './events/user-created.event';

const eventClient = new EventClient({
  transports: [new BasicEventTransport([UserCreatedEvent])],
  logger: console, // must implement EventLogger interface
});

await eventClient.init();
```

### Handling Events with Decorators

```typescript
import { EventInterceptor, EventListener } from '@selvoc/event-client';
import { UserCreatedEvent } from './events/user-created.event';

@EventInterceptor()
class UserEventHandler {
  @EventListener(UserCreatedEvent)
  async handleUserCreated(event: UserCreatedEvent) {
    console.log('User created:', event);
  }
}

// Just instantiate the handler to register it
new UserEventHandler();
```

### Producing Events

```typescript
import { UserCreatedEvent } from './events/user-created.event';

const event = UserCreatedEvent.build('123');
await eventClient.produce(event);
```

### Validation

Validation is automatic before producing or handling. Invalid events will throw an error.

### Custom Transports

You can implement your own transport by extending the `EventTransport` abstract class.

## Caveats & Roadmap

- This is an experiment and not ready for production
- API and internals will change a lot
- Currently, only basic and rabbitmq transports are available
- Constructor parameters in event classes are not really supported (see above) unless you handle `undefined`.
- More docs, examples, and features are planned
