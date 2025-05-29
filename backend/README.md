# Backend

## NestJS Microservice Structure

```bash
src/
├── config/                       # Configuration files
├── modules/                      # Directory containing all modules
│   └── [module-name]/            # e.g., chat, user, etc.
│       ├── domain/               # Core business logic and entities
│       │   ├── entities/         # Domain entities
│       │   │   └── [entity-name].entity.ts
│       │   └── events/           # Domain events
│       │       └── [event-name].event.ts
│       ├── application/          # Use cases and orchestration
│       │   ├── exceptions/       # Custom exceptions
│       │   │   └── [exception-name].exception.ts
│       │   ├── repositories/     # Abstract repository interfaces
│       │   │   └── [repository-name].repository.interface.ts
│       │   └── services/         # Application services
│       │       └── [service-name].service.ts
│       ├── infrastructure/       # Concrete implementations
│       │   └── persistence/      # Database-specific implementations
│       │       ├── entities/     # ORM-specific entities
│       │       │   └── [entity-name].typeorm-entity.ts
│       │       └── repositories/ # Concrete repository implementations
│       │           └── [repository-name].typeorm-repository.ts
│       ├── interfaces/           # External communication
│       │   ├── graphql/          # GraphQL-specific interfaces
│       │   │   ├── dtos/         # Data Transfer Objects
│       │   │   │   └── [dto-name].dto.ts
│       │   │   └── resolvers/    # GraphQL resolvers
│       │   │       └── [resolver-name].resolver.ts
│       │   └── rest/             # REST API interfaces (optional)
│       │       └── controllers/  # REST controllers
│       │           └── [controller-name].controller.ts
│       └── module.ts             # NestJS module definition
├── persistence/
│   └── migrations/               # Database migrations
├── app.module.ts                 # Root module
└── main.ts                       # Application entry point
```
