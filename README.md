# Selvoc

**Note:** This project is currently in development. Some features and
components are still being implemented.

Selvoc is a production-grade application designed to demonstrate modern
software engineering practices. It leverages a microservices architecture,
clean architecture principles, and a variety of cutting-edge technologies to
create a scalable and maintainable system. Its concept centered around simplifying
language learning through a dynamic vocabulary builder (details of which are
secondary to the technical focus here).

## Overview

- **Languages**: TypeScript (Node.js)
- **Framework**: NestJS
- **Architecture**: Clean Architecture, Domain-Driven Design (DDD),
  Microservices
- **API**: GraphQL Federation (Apollo Federation). REST and gRPC are also
  planned
- **Database**: PostgreSQL, TypeORM
- **Authentication**: Keycloak
- **Message Broker**: RabbitMQ
- **Deployment**: AWS, Terraform, Helm charts
- **CI/CD**: GitHub Actions

## Architecture

- **User Microservice**: Manages user data and synchronizes with Keycloak.
- **Chat Microservice**: Handles chat, membership, and messaging.
- **Gateway**: Federates GraphQL APIs from all services.
- more microservices are planned
- **Shared Libraries**: Reusable NPM packages for common logic.

All services follow clean architecture and DDD principles, and communicate
asynchronously via RabbitMQ.

## Project Structure

- `backend/`: Microservices
- `configs/`: Configuration files (e.g., PostgreSQL init scripts)
- `frontend/`: Placeholder for future frontend
- `infrastructure/`: Terraform and Helm charts [detailed guide](infrastructure/README.md)
- `packages/`: Shared NPM packages
- `templates/`: Boilerplate for new services and packages

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/anatoly-turcan/selvoc.git
   cd selvoc
   ```

2. **Set Up Environment Variables**:
   - Copy `.env.example` to `.env` and adjust as needed.

3. **Start Services**:

     ```bash
     docker compose up -d
     ```

    (Or run each service individually; see each service's README.)

## Usage

- **Gateway**: `http://localhost:3000/graphql`
- **User Service**: `http://localhost:3001/graphql`
- **Chat Service**: `http://localhost:3002/graphql`

Health checks and version info are available at /health and /version on each service.

## Configuration

All configuration is via environment variables. See `.env.example` in the root and each service.

## Infrastructure & CI/CD

Selvoc uses Terraform and Helm to provision AWS infrastructure (EKS, RDS, RabbitMQ, ALB,
Route53, etc.) and deploy services. CI/CD is managed with GitHub Actions, including
infrastructure automation and microservice deployment.

For a detailed infrastructure and CI/CD guide, see [infrastructure/README.md](infrastructure/README.md).

## Future Plans

- Frontend (React)
- WebSocket gateway for real-time features
- Additional microservices (e.g., vocabulary, learning modules)
- LLM integration for contextual explanations
