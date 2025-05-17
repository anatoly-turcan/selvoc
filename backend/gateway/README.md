# Gateway Microservice

This microservice serves as the GraphQL API gateway for the Selvoc backend,
federating multiple subgraphs (such as user and chat services) into a single GraphQL endpoint.
It is built with NestJS and Apollo Federation.

## Features

- GraphQL API gateway (Apollo Federation)
- Federates user and chat subgraphs
- Centralized entry point for frontend clients
- Configurable via environment variables

## Technology Stack

- [NestJS](https://nestjs.com/)
- [Apollo Federation](https://www.apollographql.com/docs/federation/)
- [GraphQL](https://graphql.org/)

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- npm

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

- All configuration is managed via environment variables. See `.env.example` for details.
- The gateway will run on `http://localhost:3000` by default.

## Usage

- Access the federated GraphQL endpoint at: `http://localhost:3000/graphql` (introspection and playground enabled)
- Health check: `GET /health`
- Version info: `GET /version`
