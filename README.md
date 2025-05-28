# Selvoc

**Note:** This project is currently in development. Some features and components are still being implemented.

Selvoc is a production-grade application designed to demonstrate modern software engineering practices.
It leverages a microservices architecture, clean architecture principles, and a variety of cutting-edge technologies to create a scalable and maintainable system.
The project serves as a technical showcase, with its concept centered around simplifying language learning through a dynamic vocabulary builder (details of which are secondary to the technical focus here).

## Features

- **Microservices Architecture**: Modular backend with distinct services for user management, chat functionality, and API gateway (more planned).
- **GraphQL Federation**: Unified API gateway aggregating multiple subgraphs for seamless client interaction.
- **Event-Driven Design**: Asynchronous communication between services using RabbitMQ.
- **Authentication & Authorization**: Secure integration with Keycloak for user authentication.
- **Database Management**: PostgreSQL with TypeORM for robust data persistence and complex models.
- **Infrastructure as Code**: AWS deployment using Terraform and Helm charts for Kubernetes.
- **Real-Time Capabilities**: Planned WebSocket gateway for real-time updates.
- **Shared Libraries**: Custom NPM packages for reusable code across services.

## Technology Stack

- **Languages**: TypeScript (Node.js)
- **Framework**: NestJS
- **Architecture**: Clean Architecture, Domain-Driven Design (DDD), Microservices
- **API**: GraphQL Federation (Apollo Federation). REST and gRPC are also planned
- **Database**: PostgreSQL, TypeORM
- **Authentication**: Keycloak
- **Message Broker**: RabbitMQ
- **Logging**: Pino
- **Deployment**: AWS, Terraform, Helm charts
- **CI/CD**: GitHub Actions
- **Other**: WebSockets (planned), Custom NPM packages

## Architecture

Selvoc is built with a microservices architecture, adhering to Clean Architecture and Domain-Driven Design (DDD) principles. Each service is self-contained, focusing on a specific domain:

- **User Microservice**: Manages user data and synchronizes with Keycloak via RabbitMQ events.
- **Chat Microservice**: Handles chat creation, membership, and messaging with event-driven capabilities.
- **Gateway Microservice**: Federates GraphQL subgraphs from other services into a single, cohesive API.
- more microservices are planned

Services communicate asynchronously through RabbitMQ, ensuring loose coupling and scalability.
The architecture emphasizes separation of concerns, maintainability, and extensibility, making it suitable for a production-like environment.

## Getting Started

### Prerequisites

- Docker Compose

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/anatoly-turcan/selvoc.git
   cd selvoc
   ```

2. **Set Up Environment Variables**:
   - Copy `.env.example` to `.env` at the root and adjust variables as needed (e.g., database credentials, Keycloak settings).

3. **Start Services**:

   - Use Docker Compose to launch all services, including dependencies like PostgreSQL and RabbitMQ:

     ```bash
     docker compose up -d
     ```

   - Alternatively, run each microservice individually (check README files in each service for details)

## Usage

- **GraphQL API**: Access the federated endpoint at `http://localhost:3000/graphql` (playground enabled).
- **User Service**: GraphQL endpoint at `http://localhost:3001/graphql`.
- **Chat Service**: GraphQL endpoint at `http://localhost:3002/graphql`.
- **Health Checks**: Available at `/health` on each service.
- **Version Info**: Available at `/version` on each service.

## Configuration

Configuration is managed via environment variables. Key settings include:

- Database connection details (PostgreSQL)
- RabbitMQ credentials
- Keycloak realm and client settings
- Service ports (default: gateway on 3000, user on 3001, chat on 3002)

Refer to `.env.example` files in the root and microservice directories for required variables.

## Microservices

- **[User Microservice](./backend/user/README.md)**: Manages user data and Keycloak synchronization.
- **[Chat Microservice](./backend/chat/README.md)**: Handles chat-related operations with event-driven messaging.
- **[Gateway Microservice](./backend/gateway/README.md)**: Federates subgraphs into a unified GraphQL API.

Each microservice follows a modular structure with distinct application, domain, and infrastructure layers, adhering to clean architecture principles.

## Project Structure

- `backend/`: Microservices implementation
- `configs/`: Configuration files (e.g., Keycloak realm, PostgreSQL init scripts)
- `frontend/`: Placeholder for future frontend (not yet implemented)
- `infrastructure/`: Terraform and Helm charts
- `packages/`: Shared NPM packages (e.g., `@selvoc/common`, `@selvoc/nest-auth`)
- `templates/`: Templates for new microservices and packages

### Microservice Structure

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

## Deployment

Selvoc is designed for deployment on AWS, with infrastructure provisioned using Terraform and services deployed to AWS EKS Kubernetes via Helm charts.

## Future Plans

- **Frontend Development**: Build a client interface using React
- **WebSocket Gateway**: Implement a dedicated service for real-time features using Socket.IO and RabbitMQ.
- **Additional Microservices**: Expand functionality (e.g., vocabulary management, learning modules).
- **LLM Integration**: Incorporate a large language model for contextual explanations.
