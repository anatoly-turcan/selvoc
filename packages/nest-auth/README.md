# Nest Auth

A shared NestJS module for authentication in the Selvoc project. This package
provides common authentication utilities and wrappers to simplify development
across Selvoc backend services.

## Usage Example

```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from '@selvoc/nest-auth';

@Module({
  imports: [
    AuthModule.forRoot({
      // ...your Keycloak JWKS or other auth config here
    }),
  ],
})
export class AppModule {}
```

You can then use the provided `AuthGuard` and decorators (like `@Public()`)
in your controllers/services.
