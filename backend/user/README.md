# User Microservice

This microservice manages user data and operations, providing a GraphQL API and integrating with Keycloak for authentication and user synchronization.
Built with NestJS and following clean architecture principles, it is designed for scalability and maintainability.

## Features

- User management via GraphQL API (federated)
- Synchronization with Keycloak on user creation, registration, and update (via RabbitMQ events)
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

- All configuration is managed via environment variables. See `.env.example` for defaults and required values.
- The service will run on `http://localhost:3001` by default.

## Usage

- Access the GraphQL endpoint at: `http://localhost:3001/graphql` (federated schema, introspection and playground enabled)
- Health check: `GET /health`
- Version info: `GET /version`

## User Synchronization

User data is synchronized from Keycloak on creation, registration, and update events received via RabbitMQ.
This enables efficient querying and extension of user data beyond what Keycloak provides.

## Scripts

Common npm scripts (see `package.json` for full list):

- `start:dev` – Start in development mode with hot reload
- `start:prod` – Start in production mode
- `build` – Compile the project
- `lint` – Lint and auto-fix code
- `migration:*` – TypeORM migration commands
