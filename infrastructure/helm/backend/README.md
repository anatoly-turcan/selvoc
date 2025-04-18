# Backend Helm Chart

## Prerequisites

- Install the PostgreSQL Helm chart first, which creates a `postgres-secrets` Secret with `adminUsername` and `adminPassword` key.
- Install the RabbitMQ Helm chart then, which creates a `rabbitmq-secrets` Secret with `username` and `password` keys.
- Install the Keycloak Helm chart, create client, copy client secret. (TODO: automate this step)

## Install

- Create a `local.values.yaml` file with the following content:

```yaml
secrets:
  keycloakClientSecret: "your-client-secret-here"
```

- Install the chart:

```bash
helm install backend . -f local.values.yaml -n bobo
```
