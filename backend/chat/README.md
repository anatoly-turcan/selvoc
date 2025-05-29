# Chat Microservice

This microservice manages chat functionality, including chat creation,
membership, and messaging. It provides a GraphQL API and integrates with
Keycloak for authentication. Built with NestJS and following clean architecture
principles, it is designed for scalability and maintainability.

## Features

- Chat management via GraphQL API (federated)
- Membership and messaging support
- Health check and version endpoints
- Clean architecture and modular design
- Integration with PostgreSQL and TypeORM

## Technology Stack

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [GraphQL Federation](https://www.apollographql.com/docs/federation/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Keycloak](https://www.keycloak.org/)
- [Pino Logger](https://getpino.io/)

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- npm
- PostgreSQL
- RabbitMQ
- Keycloak

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and adjust as needed:

   ```bash
   cp .env.example .env
   ```

3. Start the service in development mode:

   ```bash
   npm run start:dev
   ```

## Configuration

- All configuration is managed via environment variables. See `.env.example` for
  defaults and required values.
- The service will run on `http://localhost:3002` by default (or as configured).

## Usage

- Access the GraphQL endpoint at: `http://localhost:3002/graphql` (federated
  schema, introspection and playground enabled)
- Health check: `GET /health`
- Version info: `GET /version`

## Chat Domain

The chat microservice supports chat creation, membership management, and
messaging. Entities include `Chat`, `ChatMembership`, and `ChatMessage`. Events
such as `ChatMemberJoined` and `ChatMessageCreated` are used for event-driven
features and integrations.

## WebSocket Support (Planned)

Real-time chat updates for the frontend are planned to be delivered via
WebSockets. Instead of implementing WebSocket logic directly in this microservice,
a separate, generic WebSocket gateway service is planned. This gateway will:

- Use socket.io for client connections
- Map RabbitMQ events to WebSocket events and vice versa
- Serve as a central hub for real-time features across multiple microservices

This approach allows for better scalability and separation of concerns. Currently,
this WebSocket gateway is not yet implemented.

> **Note:** GraphQL subscriptions are not used for real-time chat because they are
> not well-suited or scalable for high-throughput, multi-service event delivery in
> this architecture. The planned WebSocket gateway provides a more robust and
> flexible solution for real-time communication.

## Scripts

Common npm scripts (see `package.json` for full list):

- `start:dev` – Start in development mode with hot reload
- `start:prod` – Start in production mode
- `build` – Compile the project
- `lint` – Lint and auto-fix code
- `migration:*` – TypeORM migration commands
