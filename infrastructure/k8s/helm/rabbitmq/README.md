# RabbitMQ

## Configure

```bash
cp secretes-template.yaml secrets.yaml
```

- Update `secrets.yaml` with your own values.

```bash
kubectl apply -f secrets.yaml -n bobo
```

## Install

```bash
helm install rabbitmq oci://registry-1.docker.io/bitnamicharts/rabbitmq -f values.yaml -n bobo
```
