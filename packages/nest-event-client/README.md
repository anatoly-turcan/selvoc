# Nest Event Client

A NestJS wrapper for [`@selvoc/event-client`](../event-client/README.md),
created to simplify event-driven development in the Selvoc project.

## Usage Example

```typescript
import { Module } from '@nestjs/common';
import { EventClientModule } from '@selvoc/nest-event-client';

@Module({
  imports: [
    EventClientModule.forRoot({
      transports: [], // configure your transports here
      logger: console,
    }),
  ],
})
export class AppModule {}
```

See the [@selvoc/event-client README](../event-client/README.md) for event
usage and configuration details.
