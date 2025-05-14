# Keycloak Helm Chart

## Prerequisites

- Install the PostgreSQL Helm chart first, which creates a `postgres-secrets` Secret with `keycloakUsername` and `keycloakPassword` keys.
- Install the RabbitMQ Helm chart then, which creates a `rabbitmq-secrets` Secret with `username` and `password` keys.

## Install

- Create a `local.values.yaml` file with the following content:

```yaml
secrets:
  adminUsername: "your-value"
  adminPassword: "your-value"
```

- Install the chart:

```bash
helm install keycloak . -f local.values.yaml -n selvoc
```
