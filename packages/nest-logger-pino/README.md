# Nest Pino Logger

A shared NestJS module for Pino-based logging in the Selvoc project. This
package provides a common logger setup for consistent logging across all
backend services.

## Usage Example

```typescript
import { Module } from '@nestjs/common';
import { PinoLoggerModule } from '@selvoc/nest-logger-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      // ...your Pino logger options here
    }),
  ],
})
export class AppModule {}
```

You can then inject and use the `PinoLogger` service in your providers.
