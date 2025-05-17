# Events

This package contains shared event definitions for the Selvoc project.
It is used with [`@selvoc/event-client`](../event-client/README.md) and related transports
to ensure consistent event contracts across all selvoc microservices.

## Provided Events

Currently, this package includes Keycloak user lifecycle events:

- `UserCreatedAdminKeycloakEvent`
- `UserRegisteredKeycloakEvent`
- `UserUpdatedAdminKeycloakEvent`

More events for other domains and services may be added as the project evolves.

## Example

```typescript
import { UserRegisteredKeycloakEvent } from '@selvoc/events';
```

See the [@selvoc/event-client README](../event-client/README.md) for more details on how events are used in selvoc.
